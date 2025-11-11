-- Create prayer_recipients table
CREATE TABLE public.prayer_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  hidden BOOLEAN NOT NULL DEFAULT false
);

-- Create participants table
CREATE TABLE public.participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create psalm_selections table
CREATE TABLE public.psalm_selections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
  prayer_recipient_id UUID NOT NULL REFERENCES public.prayer_recipients(id) ON DELETE CASCADE,
  psalm_number INTEGER NOT NULL CHECK (psalm_number >= 1 AND psalm_number <= 150),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.prayer_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psalm_selections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for prayer_recipients (public can view non-hidden, anyone can create)
CREATE POLICY "Anyone can view non-hidden prayer recipients"
  ON public.prayer_recipients
  FOR SELECT
  USING (hidden = false OR hidden IS NULL);

CREATE POLICY "Anyone can insert prayer recipients"
  ON public.prayer_recipients
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update prayer recipients"
  ON public.prayer_recipients
  FOR UPDATE
  USING (true);

-- RLS Policies for participants (public read/write)
CREATE POLICY "Anyone can view participants"
  ON public.participants
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert participants"
  ON public.participants
  FOR INSERT
  WITH CHECK (true);

-- RLS Policies for psalm_selections (public read/write)
CREATE POLICY "Anyone can view psalm selections"
  ON public.psalm_selections
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert psalm selections"
  ON public.psalm_selections
  FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_psalm_selections_participant_id ON public.psalm_selections(participant_id);
CREATE INDEX idx_psalm_selections_prayer_recipient_id ON public.psalm_selections(prayer_recipient_id);
CREATE INDEX idx_psalm_selections_psalm_number ON public.psalm_selections(psalm_number);
CREATE INDEX idx_prayer_recipients_hidden ON public.prayer_recipients(hidden);