-- ============================================================================
-- HARD CASE - Enable Realtime for Messages Table
-- ============================================================================
-- Description: Enables real-time subscriptions for the messages table
-- This allows instant message delivery without polling
-- ============================================================================

-- Enable Realtime replication for messages table (if not already enabled)
DO $$
BEGIN
  -- Check if messages is already in the publication
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public'
    AND tablename = 'messages'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE messages;
    RAISE NOTICE '✅ Realtime enabled for messages table';
  ELSE
    RAISE NOTICE '✅ Realtime already enabled for messages table';
  END IF;
END $$;

-- Verify the publication includes messages
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND tablename = 'messages'
  ) THEN
    RAISE NOTICE '✅ Realtime enabled for messages table';
  ELSE
    RAISE WARNING '❌ Failed to enable Realtime for messages table';
  END IF;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE messages IS 
  'Direct messages between trainers and clients. Realtime enabled for instant delivery.';

