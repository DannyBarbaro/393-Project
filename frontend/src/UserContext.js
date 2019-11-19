import React from 'react'

const UserContext = React.createContext({userId: null, changeUserId: ()=>{}})
UserContext.displayName = "currentUser"

export default UserContext