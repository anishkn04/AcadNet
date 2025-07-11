import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useData } from '@/hooks/userInfoContext';
import type { Groups } from '@/models/User';

const GroupAdmin = () => {
  const { retreiveGroups } = useData();
  const [group, setGroup] = useState<Groups | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const groupId = params.get('id');
    const fetchGroup = async () => {
      const data = await retreiveGroups();
      if (Array.isArray(data) && groupId) {
        const found = data.find((g) => String(g.id) === String(groupId));
        setGroup(found || null);
        setGroupName(found?.name || '');
        setGroupDescription(found?.description || '');
      } else {
        setGroup(null);
        setGroupName('');
        setGroupDescription('');
      }
    };
    fetchGroup();
  }, [location.search, retreiveGroups]);

  const handleEdit = () => setEditMode(true);
  const handleSave = () => {
    // TODO: Implement save logic (API call)
    setEditMode(false);
  };

  return (
    <div className="relative flex size-full min-h-screen flex-col group/design-root overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        <div className="flex flex-1 py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1 px-8 py-6">
            <div className="flex flex-wrap justify-between items-center gap-3 pb-6">
              <div className="flex flex-col gap-1">
                <p className="text-slate-900 text-2xl font-bold leading-tight">Study Group Admin Panel</p>
                <p className="text-slate-500 text-sm font-normal leading-normal">Manage group settings, reports, and members.</p>
              </div>
            </div>
            <div className="space-y-8">
              <section>
                <h2 className="text-slate-800 text-xl font-semibold leading-tight tracking-tight pb-4">Settings</h2>
                <div className="space-y-6 max-w-xl">
                  <div>
                    <label className="block text-slate-700 text-sm font-medium leading-normal pb-1.5" htmlFor="groupName">Group Name</label>
                    <Input
                      type='text'
                      id='groupName'
                      value={groupName}
                      onChange={e => setGroupName(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 text-sm font-medium leading-normal pb-1.5" htmlFor="groupDescription">Group Description</label>
                    <textarea
                      className="form-textarea flex w-full min-w-0 flex-1 resize-y overflow-hidden rounded-lg text-slate-900 focus:outline-0  border border-slate-300 bg-white  placeholder:text-slate-400 px-3.5 py-2.5 text-sm font-normal leading-normal shadow-sm"
                      id="groupDescription"
                      placeholder="Enter a brief description of the study group..."
                      rows={4}
                      value={groupDescription}
                      onChange={e => setGroupDescription(e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="flex justify-start">
                    {editMode ? (
                      <button
                        className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-sky-600 text-white text-sm font-semibold leading-normal tracking-wide shadow-sm hover:bg-sky-700 transition-colors duration-150"
                        onClick={handleSave}
                      >
                        <span className="truncate">Save Changes</span>
                      </button>
                    ) : (
                      <button
                        className="flex items-center justify-center overflow-hidden rounded-lg h-10 px-5 bg-gray-300 text-slate-800 text-sm font-semibold leading-normal tracking-wide shadow-sm hover:bg-gray-400 focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 transition-colors duration-150"
                        onClick={handleEdit}
                      >
                        <span className="truncate">Edit</span>
                      </button>
                    )}
                  </div>
                </div>
              </section>
              <section>
                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm @container">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Member</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">(Members list not implemented)</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">-</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupAdmin;