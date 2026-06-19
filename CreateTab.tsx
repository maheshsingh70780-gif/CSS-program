import React, { useState } from 'react';
import { Plus, Trash2, Layout, BookOpen, Layers, CheckSquare, Sparkles } from 'lucide-react';
import { SkillTrack } from '../types';

interface CreateTabProps {
  onAddTrack: (newTrack: SkillTrack) => void;
  userName: string;
}

export default function CreateTab({ onAddTrack, userName }: CreateTabProps) {
  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Frontend Engineering');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('2026-07-15');
  const [expectedOutcome, setExpectedOutcome] = useState('');
  
  // Dynamic features list
  const [featureInputs, setFeatureInputs] = useState<string[]>([
    'Configure reactive state orchestration',
    'Deploy and bundle files cleanly with esbuild'
  ]);
  const [newFeatureText, setNewFeatureText] = useState('');

  const [isSuccessTip, setIsSuccessTip] = useState(false);

  // Add key feature to list
  function handleAddFeature(e: React.MouseEvent) {
    e.preventDefault();
    if (newFeatureText.trim()) {
      setFeatureInputs([...featureInputs, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  }

  // Remove key feature from list
  function handleRemoveFeature(index: number) {
    const updated = [...featureInputs];
    updated.splice(index, 1);
    setFeatureInputs(updated);
  }

  // Submit complete track to list
  function handleSubmitTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Title and Description are required!");
      return;
    }

    // Format the date into a friendly readable format e.g., "15 Jul 2026"
    let formattedDate = dueDate;
    try {
      const parsedDate = new Date(dueDate);
      if (!isNaN(parsedDate.getTime())) {
        const day = parsedDate.getDate();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = months[parsedDate.getMonth()];
        const year = parsedDate.getFullYear();
        formattedDate = `${day} ${month} ${year}`;
      }
    } catch (err) {
      // fallback
    }

    // Days left calculator relative to now
    let daysLeft = 30;
    try {
      const parsedDate = new Date(dueDate);
      const diffTime = parsedDate.getTime() - new Date().getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) daysLeft = diffDays;
    } catch (_) {}

    const newTrack: SkillTrack = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      category,
      status: 'AVAILABLE',
      dueDate: formattedDate,
      daysLeft,
      keyFeatures: featureInputs.filter(f => f.trim() !== ''),
      expectedOutcome: expectedOutcome.trim() || 'Learn high-level modular concepts with hands-on labs.',
      author: {
        name: userName || 'Mahesh Singh',
        avatarInitials: (userName || 'MS').split(' ').map(n => n[0]).join('').toUpperCase()
      }
    };

    onAddTrack(newTrack);
    
    // Show success banner and reset form
    setIsSuccessTip(true);
    setTitle('');
    setDescription('');
    setExpectedOutcome('');
    setFeatureInputs(['Build reactive component maps']);
    
    setTimeout(() => {
      setIsSuccessTip(false);
    }, 4000);
  }

  return (
    <div className="bg-white border border-[#c3c6d7] rounded-xl overflow-hidden shadow-sm" id="create-tab-form">
      {/* Decorative Brand Ribbon */}
      <div className="bg-[#004ac6] text-white p-6 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-headline font-bold text-lg flex items-center gap-2">
            <Plus className="h-5 w-5" /> Curate Custom Skill Track
          </h2>
          <p className="text-xs text-white/85">Add custom technology goals, timelines, and check criteria to your local feed board.</p>
        </div>
        <BookOpen className="h-10 w-10 text-white/20 hidden sm:block" />
      </div>

      <div className="p-6">
        {isSuccessTip && (
          <div className="mb-6 p-4 bg-green-50 text-green-800 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in" id="create-success-toast">
            <Sparkles className="h-5 w-5 text-green-600 shrink-0" />
            <div className="text-xs">
              <p className="font-bold">Track Created Successfully!</p>
              <p className="text-green-700">Check the <strong>Feed</strong> tab to view and start. Your customized pre-requisites are configured.</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmitTrack} className="space-y-6">
          {/* Track Title */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#191c1e] block">Track Title:</label>
            <input
              type="text"
              placeholder="e.g., Docker Basics & Containerization workflows"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-xs h-10 px-3 border border-[#c3c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
          </div>

          {/* Category & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#191c1e] block">Track Category:</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs h-10 px-3 border border-[#c3c6d7] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              >
                <option value="Frontend Engineering">Frontend Engineering</option>
                <option value="Full-Stack Development">Full-Stack Development</option>
                <option value="Backend Engineering">Backend Engineering</option>
                <option value="Cloud Engineering">Cloud Engineering</option>
                <option value="System Design">System Design & Devops</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#191c1e] block">Target Timeline / Due Date:</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs h-10 px-3 border border-[#c3c6d7] bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#191c1e] block">Primary Description & Objectives:</label>
            <textarea
              placeholder="Provide a comprehensive summary of what developers will learn and the key skills they will capture upon completion of this track..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-3 border border-[#c3c6d7] rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
          </div>

          {/* Expected Outcome */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#191c1e] block">Expected Final Outcome (Optional):</label>
            <input
              type="text"
              placeholder="e.g. A fully operational containerized image serving static assets securely on port 3000."
              value={expectedOutcome}
              onChange={(e) => setExpectedOutcome(e.target.value)}
              className="w-full text-xs h-10 px-3 border border-[#c3c6d7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
            />
          </div>

          {/* DYNAMIC KEY FEATURES ARRAY BUILDER */}
          <div className="space-y-3 p-4 rounded-xl border border-[#c3c6d7] bg-[#f2f4f6]/50">
            <label className="text-xs font-bold text-[#191c1e] flex justify-between items-center">
              <span>Key Features / Validation Rules:</span>
              <span className="font-mono text-[10px] text-[#737686]">{featureInputs.length} added</span>
            </label>

            {/* List of current feature inputs */}
            <div className="space-y-2">
              {featureInputs.map((feat, index) => (
                <div key={index} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-[#c3c6d7]">
                  <CheckSquare className="h-4 w-4 text-[#004ac6] shrink-0" />
                  <span className="text-xs text-[#434655] flex-1">{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="p-1 text-[#ba1a1a] hover:bg-red-50 rounded"
                    title="Remove rule"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Feature input submission line */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add standard checks (e.g. setup Dockerfile configurations)"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (newFeatureText.trim()) {
                      setFeatureInputs([...featureInputs, newFeatureText.trim()]);
                      setNewFeatureText('');
                    }
                  }
                }}
                className="flex-1 text-xs px-3 py-2 border border-[#c3c6d7] rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 bg-[#e0e3e5]/80 hover:bg-[#c3c6d7] text-[#191c1e] text-xs font-bold rounded-lg flex items-center gap-1 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setTitle('');
                setDescription('');
                setExpectedOutcome('');
                setFeatureInputs(['Build modular architectures']);
              }}
              className="flex-1 py-3 border border-[#c3c6d7] text-[#434655] font-sans font-bold text-xs rounded-lg hover:bg-slate-50 transition-all outline-none"
            >
              Reset Form
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-[#2563eb] hover:bg-[#004ac6] text-white font-sans font-bold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1.5"
            >
              <Layout className="h-4 w-4" /> Deploy Track to Feed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
