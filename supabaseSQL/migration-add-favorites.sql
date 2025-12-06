-- Migration: Add Favorites System
-- Description: Adds is_favorite column to cards table for favorite functionality

-- Add is_favorite column to cards table
ALTER TABLE cards 
ADD COLUMN is_favorite BOOLEAN DEFAULT false NOT NULL;

-- Create index for faster favorite filtering
CREATE INDEX idx_cards_is_favorite ON cards(user_id, is_favorite) WHERE is_favorite = true;

-- Add comment for documentation
COMMENT ON COLUMN cards.is_favorite IS 'Whether the card is marked as favorite by the user';
