import React, { useState } from 'react';
import { AuthorMetadata } from '../types';
import { User, Building, Mail, CreditCard, PenTool } from 'lucide-react';

interface AuthorMetadataFormProps {
  onSubmit: (data: AuthorMetadata) => void;
  isLoading: boolean;
}

export const AuthorMetadataForm: React.FC<AuthorMetadataFormProps> = ({ onSubmit, isLoading }) => {
  const [data, setData] = useState<AuthorMetadata>({
    fullName: '',
    affiliation: '',
    department: '',
    email: '',
    orcid: '',
    funding: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-xl shadow-lg border border-slate-200 p-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <PenTool className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Author Metadata</h2>
        <p className="text-slate-500">
          Enter the details to be embedded in the manuscript preamble.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <User className="w-4 h-4" /> Full Name
            </label>
            <input
              required
              name="fullName"
              value={data.fullName}
              onChange={handleChange}
              placeholder="Dr. Jane Doe"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              required
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="jane.doe@university.edu"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <Building className="w-4 h-4" /> Institution Affiliation
          </label>
          <input
            required
            name="affiliation"
            value={data.affiliation}
            onChange={handleChange}
            placeholder="Massachusetts Institute of Technology"
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">Department</label>
            <input
              name="department"
              value={data.department}
              onChange={handleChange}
              placeholder="Dept. of Computer Science"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
           <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">ORCID (Optional)</label>
            <input
              name="orcid"
              value={data.orcid}
              onChange={handleChange}
              placeholder="0000-0000-0000-0000"
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <CreditCard className="w-4 h-4" /> Funding / Acknowledgments (Optional)
          </label>
          <input
            name="funding"
            value={data.funding}
            onChange={handleChange}
            placeholder="Supported by NSF Grant #12345..."
            className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
        >
          {isLoading ? "Initializing..." : "Begin Manuscript Drafting"}
        </button>
      </form>
    </div>
  );
};