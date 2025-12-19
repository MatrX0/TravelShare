import { useParams } from 'react-router-dom';

// Example of how to update your existing GroupDetail.jsx
// Add this import at the top and update the component

function GroupDetailExample({ user, onNavigate, onLogout, darkMode, toggleDarkMode }) {
  const { groupId } = useParams(); // Get groupId from URL
  
  // Now you can use groupId directly
  // Example: fetch group data using groupId
  
  return (
    <div>
      <h1>Group Detail Page</h1>
      <p>Group ID: {groupId}</p>
      {/* Rest of your GroupDetail component */}
    </div>
  );
}

export default GroupDetailExample;

/* 
Instructions for updating your existing GroupDetail.jsx:

1. Add this import at the top:
   import { useParams } from 'react-router-dom';

2. Inside your component, get the groupId:
   const { groupId } = useParams();

3. Remove groupId from props (it now comes from URL)
   
4. Use groupId normally in your component

Example:
function GroupDetail({ user, onNavigate, onLogout, darkMode, toggleDarkMode }) {
  const { groupId } = useParams(); // NEW
  
  useEffect(() => {
    // Fetch group data using groupId
    fetchGroupData(groupId);
  }, [groupId]);
  
  // Rest of your existing code...
}
*/
