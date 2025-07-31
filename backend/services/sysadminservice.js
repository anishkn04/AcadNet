// Sysadmin service for dashboard logic
export const getDashboard = (user) => {
  // For now, just log and return a message
  if (user.role === "admin") {
    console.log("Welcome to SysAdmin Dashboard");
    return { message: "SysAdmin Dashboard Access Granted" };
  } else {
    return { message: "Access Denied: Not an Admin" };
  }
};
