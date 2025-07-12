import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { fetchOverviewAPI } from '@/services/UserServices';

const Overview = () => {
  const location = useLocation();
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get group code from URL
  const params = new URLSearchParams(location.search);
  const groupCode = params.get('code');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (groupCode) {
        try {
          const {data,status} = await fetchOverviewAPI(groupCode)
          if(status === 200){
            console.log(data)
            setGroup(data)
          }
        } catch (error) {
          console.error('Error fetching group overview:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchData();
  }, [groupCode]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }
  if (!group) {
    return <div className="flex justify-center items-center h-64">Group not found.</div>;
  }

  // File counts by type and display
  const fileCounts = group.fileCounts || {};
  const totalFiles = group.totalFiles || 0;

  // Debug logging
  // console.log('Group object structure:', group);
  // console.log('Creator info:', {
  //   creatorName: group.creatorName,
  //   UserModel: group.UserModel,
  //   fullName: group.UserModel?.fullName,
  //   username: group.UserModel?.username
  // });
  // console.log('File info:', {
  //   fileCounts,
  //   totalFiles,
  //   AdditionalResources: group.AdditionalResources
  // });
  // console.log('Syllabus info:', {
  //   syllabus: group.syllabus,
  //   topics: group.syllabus?.topics
  // });

  return (
    <div className="container mx-auto p-8">
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{group.name || 'Group Name'}</CardTitle>
          <CardDescription>{group.description || 'No description available'}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 items-center">
            <div>
              <span className="font-semibold">Creator:</span> {
                group.creatorName || 
                group.UserModel?.fullName || 
                group.UserModel?.username || 
                'Creator information not available'
              }
            </div>
            <div>
              <span className="font-semibold">Members:</span> {group.membersCount || 0}
            </div>
            <div>
              <span className="font-semibold">Files:</span> {totalFiles}
            </div>
            {Object.keys(fileCounts).length > 0 && (
              <div className="flex gap-2">
                <span className="text-sm text-gray-600">File types:</span>
                {Object.entries(fileCounts).map(([type, count]) => (
                  <span key={type} className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                    {type.toUpperCase()}: {String(count)}
                  </span>
                ))}
              </div>
            )}
            {totalFiles === 0 && (
              <div className="text-sm text-gray-500">
                No files uploaded yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Syllabus</CardTitle>
        </CardHeader>
        <CardContent>
          {(group.syllabus?.topics && group.syllabus.topics.length > 0) ? (
            <div className="flex flex-col gap-4">
              {group.syllabus.topics.map((topic: any) => (
                <div key={topic.id} className="bg-white rounded-xl shadow p-4 border border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-lg font-bold">
                      📚
                    </span>
                    <h4 className="font-bold text-lg">{topic.title}</h4>
                  </div>
                  {topic.description && (
                    <p className="text-gray-500 text-sm mb-2">{topic.description}</p>
                  )}
                  {topic.subTopics && topic.subTopics.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {topic.subTopics.map((subtopic: any) => (
                        <span
                          key={subtopic.id}
                          className="inline-flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                        >
                          📝 {subtopic.title}
                          {subtopic.content && (
                            <span className="ml-1 text-gray-400">({subtopic.content})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📄</div>
              <p className="text-lg font-medium">No syllabus available</p>
              <p className="text-sm">This group hasn't added a syllabus yet.</p>
              {group.syllabus && !group.syllabus.topics && (
                <p className="text-xs mt-2 text-red-500">Syllabus object exists but no topics found.</p>
              )}
              {!group.syllabus && (
                <p className="text-xs mt-2 text-red-500">No syllabus object found.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Overview;
