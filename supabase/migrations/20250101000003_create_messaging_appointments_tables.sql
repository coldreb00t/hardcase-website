-- ============================================================================
-- HARD CASE - Messaging & Appointments Tables Migration
-- ============================================================================
-- Description: Creates real-time messaging and appointment scheduling tables
-- Version: 1.0.0
-- Compatible with: Web (Next.js), iOS (Swift), Android (Kotlin)
-- ============================================================================

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE appointment_status AS ENUM ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show');
CREATE TYPE message_type AS ENUM ('text', 'image', 'video', 'file', 'system');

-- ============================================================================
-- CONVERSATIONS TABLE
-- ============================================================================
-- Represents a chat conversation between trainer and client
-- Used by: Web chat, Mobile app messaging

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Participants (always 1-on-1 between trainer and client)
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Status
  is_active BOOLEAN DEFAULT true NOT NULL,
  is_archived BOOLEAN DEFAULT false NOT NULL,

  -- Last message info (denormalized for performance)
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,

  -- Unread counts (denormalized for performance)
  unread_count_trainer INTEGER DEFAULT 0 NOT NULL,
  unread_count_client INTEGER DEFAULT 0 NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  UNIQUE(trainer_id, client_id),
  CONSTRAINT different_participants CHECK (trainer_id != client_id)
);

-- Indexes
CREATE INDEX idx_conversations_trainer ON conversations(trainer_id);
CREATE INDEX idx_conversations_client ON conversations(client_id);
CREATE INDEX idx_conversations_active ON conversations(is_active) WHERE is_active = true;
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC NULLS LAST);

-- ============================================================================
-- MESSAGES TABLE
-- ============================================================================
-- Individual messages in conversations
-- Used by: Realtime subscriptions, Web/Mobile chat

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,

  -- Sender
  sender_id UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Message content
  message_type message_type DEFAULT 'text' NOT NULL,
  content TEXT NOT NULL,

  -- Attachments (for images/files stored in Supabase Storage)
  attachment_url TEXT,
  attachment_type TEXT, -- mime type
  attachment_size_bytes INTEGER,

  -- Read status
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,

  -- Editing/Deletion
  edited_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  is_deleted BOOLEAN DEFAULT false NOT NULL,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  -- Example: { "reply_to": "uuid", "reactions": ["👍", "❤️"] }

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_content CHECK (LENGTH(content) > 0 OR attachment_url IS NOT NULL)
);

-- Indexes
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_created ON messages(created_at DESC);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(read_at) WHERE read_at IS NULL;
CREATE INDEX idx_messages_not_deleted ON messages(is_deleted) WHERE is_deleted = false;

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================
-- Scheduled consultations/video calls between trainer and client
-- Used by: Web dashboard calendar, Mobile app scheduling

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Participants
  trainer_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  -- Scheduling
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60 NOT NULL,
  ends_at TIMESTAMPTZ GENERATED ALWAYS AS (scheduled_at + (duration_minutes || ' minutes')::INTERVAL) STORED,

  -- Title and description
  title TEXT NOT NULL,
  description TEXT,
  appointment_type TEXT, -- e.g., "initial_consultation", "monthly_review", "technique_check"

  -- Status
  status appointment_status DEFAULT 'scheduled' NOT NULL,

  -- Video call
  video_link TEXT,
  meeting_platform TEXT, -- e.g., "zoom", "google_meet", "custom"

  -- Completion details
  completed_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  cancelled_by UUID REFERENCES profiles(id),

  -- Notes
  trainer_notes TEXT, -- Notes taken during appointment
  client_notes TEXT,

  -- Reminders sent
  reminder_sent_at TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Constraints
  CONSTRAINT valid_duration CHECK (duration_minutes > 0 AND duration_minutes <= 480),
  CONSTRAINT different_participants CHECK (trainer_id != client_id),
  CONSTRAINT valid_cancellation CHECK (
    (status = 'cancelled' AND cancelled_at IS NOT NULL AND cancelled_by IS NOT NULL) OR
    (status != 'cancelled')
  )
);

-- Indexes
CREATE INDEX idx_appointments_trainer ON appointments(trainer_id);
CREATE INDEX idx_appointments_client ON appointments(client_id);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at DESC);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_upcoming ON appointments(scheduled_at)
  WHERE status IN ('scheduled', 'confirmed') AND scheduled_at > NOW();
CREATE INDEX idx_appointments_trainer_upcoming ON appointments(trainer_id, scheduled_at)
  WHERE status IN ('scheduled', 'confirmed') AND scheduled_at > NOW();
CREATE INDEX idx_appointments_client_upcoming ON appointments(client_id, scheduled_at)
  WHERE status IN ('scheduled', 'confirmed') AND scheduled_at > NOW();

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
-- App notifications for clients and trainers
-- Used by: Web notifications, Mobile push notifications

CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Notification content
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type TEXT NOT NULL, -- e.g., "new_message", "appointment_reminder", "workout_due", "report_ready"

  -- Links/Actions
  action_url TEXT,
  action_label TEXT,

  -- Related entities
  related_id UUID, -- ID of related entity (message, appointment, etc.)
  related_type TEXT, -- Type of related entity

  -- Status
  read_at TIMESTAMPTZ,
  clicked_at TIMESTAMPTZ,

  -- Push notification tracking
  pushed_at TIMESTAMPTZ,
  push_token TEXT,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);
CREATE INDEX idx_notifications_expires ON notifications(expires_at) WHERE expires_at IS NOT NULL;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER FUNCTIONS FOR REALTIME
-- ============================================================================

-- Update conversation when new message is sent
CREATE OR REPLACE FUNCTION update_conversation_on_new_message()
RETURNS TRIGGER AS $$
DECLARE
  is_trainer BOOLEAN;
BEGIN
  -- Check if sender is trainer or client
  SELECT (p.role = 'trainer')
  INTO is_trainer
  FROM profiles p
  WHERE p.id = NEW.sender_id;

  -- Update conversation
  UPDATE conversations
  SET
    last_message_at = NEW.created_at,
    last_message_preview = LEFT(NEW.content, 100),
    unread_count_trainer = CASE
      WHEN is_trainer THEN unread_count_trainer
      ELSE unread_count_trainer + 1
    END,
    unread_count_client = CASE
      WHEN is_trainer THEN unread_count_client + 1
      ELSE unread_count_client
    END,
    updated_at = NOW()
  WHERE id = NEW.conversation_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_on_new_message
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_conversation_on_new_message();

-- Reset unread count when messages are read
CREATE OR REPLACE FUNCTION reset_unread_count_on_read()
RETURNS TRIGGER AS $$
DECLARE
  is_trainer BOOLEAN;
BEGIN
  IF NEW.read_at IS NOT NULL AND OLD.read_at IS NULL THEN
    -- Check who is reading (not the sender)
    SELECT (p.role = 'trainer')
    INTO is_trainer
    FROM profiles p
    JOIN conversations c ON (c.trainer_id = p.id OR c.client_id = p.id)
    WHERE c.id = NEW.conversation_id
      AND p.id != NEW.sender_id
    LIMIT 1;

    IF is_trainer THEN
      UPDATE conversations
      SET unread_count_trainer = GREATEST(0, unread_count_trainer - 1)
      WHERE id = NEW.conversation_id;
    ELSE
      UPDATE conversations
      SET unread_count_client = GREATEST(0, unread_count_client - 1)
      WHERE id = NEW.conversation_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_reset_unread_count_on_read
  AFTER UPDATE ON messages
  FOR EACH ROW
  WHEN (NEW.read_at IS DISTINCT FROM OLD.read_at)
  EXECUTE FUNCTION reset_unread_count_on_read();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Get or create conversation between trainer and client
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  p_trainer_id UUID,
  p_client_id UUID
)
RETURNS UUID AS $$
DECLARE
  conversation_id UUID;
BEGIN
  -- Try to find existing conversation
  SELECT id INTO conversation_id
  FROM conversations
  WHERE trainer_id = p_trainer_id AND client_id = p_client_id;

  -- If not found, create new conversation
  IF conversation_id IS NULL THEN
    INSERT INTO conversations (trainer_id, client_id)
    VALUES (p_trainer_id, p_client_id)
    RETURNING id INTO conversation_id;
  END IF;

  RETURN conversation_id;
END;
$$ LANGUAGE plpgsql;

-- Mark all messages as read in a conversation
CREATE OR REPLACE FUNCTION mark_conversation_as_read(
  p_conversation_id UUID,
  p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  affected_rows INTEGER;
  is_trainer BOOLEAN;
BEGIN
  -- Check if user is trainer
  SELECT (p.role = 'trainer')
  INTO is_trainer
  FROM profiles p
  WHERE p.user_id = p_user_id;

  -- Mark messages as read
  UPDATE messages
  SET read_at = NOW()
  WHERE conversation_id = p_conversation_id
    AND sender_id != (SELECT id FROM profiles WHERE user_id = p_user_id)
    AND read_at IS NULL;

  GET DIAGNOSTICS affected_rows = ROW_COUNT;

  -- Reset unread count
  IF is_trainer THEN
    UPDATE conversations
    SET unread_count_trainer = 0
    WHERE id = p_conversation_id;
  ELSE
    UPDATE conversations
    SET unread_count_client = 0
    WHERE id = p_conversation_id;
  END IF;

  RETURN affected_rows;
END;
$$ LANGUAGE plpgsql;

-- Get upcoming appointments for user
CREATE OR REPLACE FUNCTION get_upcoming_appointments(
  p_user_id UUID,
  days_ahead INTEGER DEFAULT 7
)
RETURNS TABLE (
  appointment_id UUID,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  title TEXT,
  other_participant_name TEXT,
  status appointment_status
) AS $$
  SELECT
    a.id,
    a.scheduled_at,
    a.duration_minutes,
    a.title,
    CASE
      WHEN p.user_id = p_user_id THEN p2.full_name
      ELSE p.full_name
    END,
    a.status
  FROM appointments a
  JOIN profiles p ON (a.trainer_id = p.id OR a.client_id = p.id)
  LEFT JOIN profiles p2 ON (
    CASE
      WHEN a.trainer_id = p.id THEN a.client_id
      ELSE a.trainer_id
    END = p2.id
  )
  WHERE p.user_id = p_user_id
    AND a.status IN ('scheduled', 'confirmed')
    AND a.scheduled_at BETWEEN NOW() AND NOW() + (days_ahead || ' days')::INTERVAL
  ORDER BY a.scheduled_at ASC;
$$ LANGUAGE sql STABLE;

-- Check for appointment conflicts
CREATE OR REPLACE FUNCTION has_appointment_conflict(
  p_trainer_id UUID,
  p_scheduled_at TIMESTAMPTZ,
  p_duration_minutes INTEGER,
  p_exclude_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  conflict_count INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO conflict_count
  FROM appointments
  WHERE trainer_id = p_trainer_id
    AND status IN ('scheduled', 'confirmed')
    AND id != COALESCE(p_exclude_id, '00000000-0000-0000-0000-000000000000'::UUID)
    AND (
      -- New appointment starts during existing appointment
      (p_scheduled_at >= scheduled_at AND p_scheduled_at < ends_at)
      OR
      -- New appointment ends during existing appointment
      (p_scheduled_at + (p_duration_minutes || ' minutes')::INTERVAL > scheduled_at
       AND p_scheduled_at + (p_duration_minutes || ' minutes')::INTERVAL <= ends_at)
      OR
      -- New appointment completely overlaps existing appointment
      (p_scheduled_at <= scheduled_at
       AND p_scheduled_at + (p_duration_minutes || ' minutes')::INTERVAL >= ends_at)
    );

  RETURN conflict_count > 0;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE conversations IS 'Chat conversations between trainers and clients';
COMMENT ON TABLE messages IS 'Individual chat messages with realtime support';
COMMENT ON TABLE appointments IS 'Scheduled video consultations and meetings';
COMMENT ON TABLE notifications IS 'In-app and push notifications for users';
COMMENT ON FUNCTION get_or_create_conversation IS 'Gets existing or creates new conversation';
COMMENT ON FUNCTION mark_conversation_as_read IS 'Marks all unread messages as read';
COMMENT ON FUNCTION get_upcoming_appointments IS 'Returns upcoming appointments for a user';
COMMENT ON FUNCTION has_appointment_conflict IS 'Checks if appointment time conflicts with existing ones';
