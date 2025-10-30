-- ============================================================================
-- HARD CASE - Messages System
-- ============================================================================
-- Description: Creates messages table for trainer-client communication
-- Features:
--   - Direct messages between trainers and clients
--   - Read/unread status tracking
--   - Chronological ordering
--   - RLS policies for privacy
-- ============================================================================

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,

  -- Constraints
  CONSTRAINT message_not_empty CHECK (length(trim(message)) > 0),
  CONSTRAINT sender_receiver_different CHECK (sender_id != receiver_id)
);

-- Create indexes for performance
CREATE INDEX idx_messages_sender ON messages(sender_id, created_at DESC);
CREATE INDEX idx_messages_receiver ON messages(receiver_id, created_at DESC);
CREATE INDEX idx_messages_conversation ON messages(sender_id, receiver_id, created_at DESC);
CREATE INDEX idx_messages_unread ON messages(receiver_id, is_read) WHERE is_read = false;

-- Enable Row Level Security
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Users can view messages they sent or received
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    sender_id = public.get_my_profile_id() OR
    receiver_id = public.get_my_profile_id()
  );

-- Users can send messages
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = public.get_my_profile_id()
  );

-- Users can mark their received messages as read
CREATE POLICY "Users can mark messages as read"
  ON messages FOR UPDATE
  TO authenticated
  USING (receiver_id = public.get_my_profile_id())
  WITH CHECK (receiver_id = public.get_my_profile_id());

-- Admins can view all messages
CREATE POLICY "Admins can view all messages"
  ON messages FOR SELECT
  TO authenticated
  USING (public.get_my_role() = 'admin');

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to get unread message count for current user
CREATE OR REPLACE FUNCTION public.get_unread_message_count()
RETURNS INTEGER
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COUNT(*)::INTEGER
  FROM public.messages
  WHERE receiver_id = public.get_my_profile_id()
    AND is_read = false;
$$;

-- Function to mark all messages from a specific user as read
CREATE OR REPLACE FUNCTION public.mark_messages_as_read(sender_profile_id UUID)
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
  UPDATE public.messages
  SET is_read = true
  WHERE receiver_id = public.get_my_profile_id()
    AND sender_id = sender_profile_id
    AND is_read = false;
$$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE messages IS
  'Stores direct messages between trainers and clients';

COMMENT ON COLUMN messages.sender_id IS
  'Profile ID of the user who sent the message';

COMMENT ON COLUMN messages.receiver_id IS
  'Profile ID of the user who receives the message';

COMMENT ON COLUMN messages.is_read IS
  'Whether the message has been read by the receiver';

COMMENT ON FUNCTION get_unread_message_count() IS
  'Returns the number of unread messages for the current user';

COMMENT ON FUNCTION mark_messages_as_read(UUID) IS
  'Marks all messages from a specific sender as read';
