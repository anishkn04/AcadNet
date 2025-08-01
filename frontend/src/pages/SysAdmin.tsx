import { useState, useEffect } from 'react';
import { toast } from "@/utils/toast";
import { 
  sysadminDashboardAPI, 
  getStatsAPI, 
  listAllUsersAPI, 
  deleteUserByIdAPI, 
  listAllGroupsAPI, 
  deleteGroupByIdAPI, 
  searchUserByUsernameAPI, 
  searchGroupByNameAPI 
} from '@/services/UserServices';
import type { SysAdminStats, SysAdminUser, SysAdminGroup } from '@/models/User';
import ConfirmationModal from '@/components/ui/confirmation-modal';

const SysAdmin = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'groups'>('dashboard');
  const [stats, setStats] = useState<SysAdminStats | null>(null);
  const [users, setUsers] = useState<SysAdminUser[]>([]);
  const [groups, setGroups] = useState<SysAdminGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [groupSearchTerm, setGroupSearchTerm] = useState('');
  
  // Confirmation modal states
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  const [groupToDelete, setGroupToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check admin access and load dashboard
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        await sysadminDashboardAPI();
        // If successful, user has admin access
        loadStats();
      } catch (error: any) {
        console.error('Admin access denied:', error);
      }
    };

    checkAdminAccess();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    try {
      const { data } = await getStatsAPI();
      if (data.success) {
        setStats(data.message);
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
      toast.error('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const { data } = await listAllUsersAPI();
      if (data.success) {
        setUsers(data.message);
      }
    } catch (error: any) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const loadGroups = async () => {
    setLoading(true);
    try {
      const { data } = await listAllGroupsAPI();
      if (data.success) {
        setGroups(data.message);
      }
    } catch (error: any) {
      console.error('Error loading groups:', error);
      toast.error('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async () => {
    if (!userSearchTerm.trim()) {
      loadUsers();
      return;
    }

    setLoading(true);
    try {
      const { data } = await searchUserByUsernameAPI(userSearchTerm);
      if (data.success) {
        setUsers([data.message]);
      } else {
        setUsers([]);
        toast.info('No users found');
      }
    } catch (error: any) {
      console.error('Error searching users:', error);
      if (error.response?.status === 404) {
        setUsers([]);
        toast.info('No users found');
      } else {
        toast.error('Failed to search users');
      }
    } finally {
      setLoading(false);
    }
  };

  const searchGroups = async () => {
    if (!groupSearchTerm.trim()) {
      loadGroups();
      return;
    }

    setLoading(true);
    try {
      const { data } = await searchGroupByNameAPI(groupSearchTerm);
      if (data.success) {
        const group = data.message;
        const formattedGroup: SysAdminGroup = {
          groupId: group.id,
          groupName: group.name,
          groupOwner: null // We'll need to fetch owner details separately if needed
        };
        setGroups([formattedGroup]);
      } else {
        setGroups([]);
        toast.info('No groups found');
      }
    } catch (error: any) {
      console.error('Error searching groups:', error);
      if (error.response?.status === 404) {
        setGroups([]);
        toast.info('No groups found');
      } else {
        toast.error('Failed to search groups');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);
    try {
      const { data } = await deleteUserByIdAPI(userToDelete.id);
      if (data.success) {
        toast.success(`User ${userToDelete.name} deleted successfully`);
        setUsers(users.filter(user => user.user_id.toString() !== userToDelete.id));
        loadStats(); // Refresh stats
      }
    } catch (error: any) {
      console.error('Error deleting user:', error);
      if (error.response?.status === 403) {
        toast.error('Cannot delete admin users');
      } else {
        toast.error('Failed to delete user');
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteUserModal(false);
      setUserToDelete(null);
    }
  };

  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    setIsDeleting(true);
    try {
      const { data } = await deleteGroupByIdAPI(groupToDelete.id);
      if (data.success) {
        toast.success(`Group ${groupToDelete.name} deleted successfully`);
        setGroups(groups.filter(group => group.groupId.toString() !== groupToDelete.id));
        loadStats(); // Refresh stats
      }
    } catch (error: any) {
      console.error('Error deleting group:', error);
      toast.error('Failed to delete group');
    } finally {
      setIsDeleting(false);
      setShowDeleteGroupModal(false);
      setGroupToDelete(null);
    }
  };

  const handleTabChange = (tab: 'dashboard' | 'users' | 'groups') => {
    setActiveTab(tab);
    if (tab === 'users' && users.length === 0) {
      loadUsers();
    } else if (tab === 'groups' && groups.length === 0) {
      loadGroups();
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredGroups = groups.filter(group => 
    group.groupName.toLowerCase().includes(groupSearchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-blue-600 rounded-full text-white">
              <span className="material-icons text-lg">admin_panel_settings</span>
            </div>
            <div>
              <h1 className="text-gray-900 text-2xl font-bold">System Administration</h1>
              <p className="text-gray-600 text-sm">Manage users, groups, and system statistics</p>
            </div>
          </div>
          
          {/* Navigation Tabs */}
          <div className="flex space-x-1">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="material-icons-outlined text-sm mr-2 align-middle">dashboard</span>
              Dashboard
            </button>
            
            <button
              onClick={() => handleTabChange('users')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="material-icons-outlined text-sm mr-2 align-middle">people</span>
              Users
            </button>
            
            <button
              onClick={() => handleTabChange('groups')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === 'groups'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <span className="material-icons-outlined text-sm mr-2 align-middle">groups</span>
              Groups
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <span className="material-icons text-blue-600">people</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : stats?.totalUsers || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full">
                      <span className="material-icons text-green-600">groups</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Study Groups</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : stats?.totalActiveGroups || 0}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <span className="material-icons text-purple-600">folder</span>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Resources</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {loading ? '...' : stats?.totalResources || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-icons-outlined text-gray-400">search</span>
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search users by username or email..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
                      />
                    </div>
                  </div>
                  <button
                    onClick={searchUsers}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Search
                  </button>
                  <button
                    onClick={loadUsers}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Load All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Username
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          <div className="flex items-center justify-center">
                            <span className="material-icons-outlined animate-spin mr-2">refresh</span>
                            Loading users...
                          </div>
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.user_id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {user.user_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setUserToDelete({ id: user.user_id.toString(), name: user.username });
                                setShowDeleteUserModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                              title="Delete User"
                            >
                              <span className="material-icons-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'groups' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Study Group Management</h2>
            </div>
            
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="material-icons-outlined text-gray-400">search</span>
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search study groups by name..."
                        value={groupSearchTerm}
                        onChange={(e) => setGroupSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && searchGroups()}
                      />
                    </div>
                  </div>
                  <button
                    onClick={searchGroups}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Search
                  </button>
                  <button
                    onClick={loadGroups}
                    className="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Load All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Group ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Group Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          <div className="flex items-center justify-center">
                            <span className="material-icons-outlined animate-spin mr-2">refresh</span>
                            Loading groups...
                          </div>
                        </td>
                      </tr>
                    ) : filteredGroups.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                          No groups found
                        </td>
                      </tr>
                    ) : (
                      filteredGroups.map((group) => (
                        <tr key={group.groupId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {group.groupId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {group.groupName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {group.groupOwner ? (
                              <div>
                                <div className="font-medium text-gray-900">{group.groupOwner.username}</div>
                                <div className="text-xs text-gray-500">{group.groupOwner.email}</div>
                              </div>
                            ) : (
                              'Unknown'
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => {
                                setGroupToDelete({ id: group.groupId.toString(), name: group.groupName });
                                setShowDeleteGroupModal(true);
                              }}
                              className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50"
                              title="Delete Group"
                            >
                              <span className="material-icons-outlined text-lg">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteUserModal}
        onCancel={() => setShowDeleteUserModal(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone and will delete all user data including groups, resources, and forum posts.`}
        confirmText="Delete User"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />

      {/* Delete Group Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteGroupModal}
        onCancel={() => setShowDeleteGroupModal(false)}
        onConfirm={handleDeleteGroup}
        title="Delete Group"
        message={`Are you sure you want to delete group "${groupToDelete?.name}"? This action cannot be undone and will delete all group data including resources, forums, and memberships.`}
        confirmText="Delete Group"
        cancelText="Cancel"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default SysAdmin;
