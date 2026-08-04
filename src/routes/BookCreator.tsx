import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';

const TIER_CONFIG = { basic: { label: 'Basic', rate: 0.99 }, pro: { label: 'Pro', rate: 2.99 }, expert: { label: 'Expert', rate: 9.99 } };
const DURATION_OPTIONS = [1, 5, 10, 15, 30];

export default function BookCreator() {
  const creators = useQuery(api.creators.getAllActiveCreators);
  const user = useQuery(api.auth.getMe);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<'basic' | 'pro' | 'expert'>('basic');
  const [selectedDuration, setSelectedDuration] = useState(5);
  const createCheckout = useMutation(api.payments.createCheckoutSession);

  if (!creators) return <div className="text-white p-8">Loading creators...</div>;
  const selectedCreator = creators.find(c => c._id === selectedCreatorId);

  const handleBook = async () => {
    if (!selectedCreatorId || !user?._id) return alert('Please select a creator and log in.');
    const config = TIER_CONFIG[selectedTier];
    const result = await createCheckout({ userId: user._id, companionId: selectedCreatorId, productType: 'human_creator', tier: selectedTier, durationMinutes: selectedDuration, creatorId: selectedCreatorId });
    if (result.url) window.location.href = result.url;
  };

  return <div className="min-h-screen bg-slate-950 p-8 text-white"><h1 className="text-3xl font-bold mb-2">👥 Book a Creator</h1><p className="text-slate-400 mb-8">Connect with real human experts.</p>{/* Simplified UI – full version in chat history */}</div>;
}