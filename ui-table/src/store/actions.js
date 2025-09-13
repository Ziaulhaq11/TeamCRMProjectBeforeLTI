import Member from "../models/member"
export const SET_MEMBERS = "SET_MEMBERS"
export const ADD_MEMBER = 'ADD_MEMBER'
export const DELETE_MEMBER = "DELETE_MEMBER"
export const AUTHENTICATE = 'AUTHENTICATE'

export const authenticate = (userId,token) => {
  return dispatch => {
    dispatch({ type: AUTHENTICATE, userId : userId, token : token})
  }
} 

export const fetchMembers = () => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch("https://uitable-a55f7-default-rtdb.firebaseio.com/tableData.json")
      if (!response.ok) {
        throw new Error('Something went wrong')
      }
      const resData = await response.json()
      const loadedMembers = []
      for (const key in resData) {
        loadedMembers.push(
          new Member(
            key,
            resData[key].ownerId,
            resData[key].name,
            resData[key].company,
            resData[key].status,
            resData[key].notes,
          )
        );
      }
      dispatch({
        type: SET_MEMBERS,
        members : loadedMembers
      })
    }
    catch (err) {
      throw err
    }
  }
}

export const addMember = (name,company,status,notes) => {
  return async (dispatch, getState) => {
    const token = getState().token
    const userId = getState().userId
    try {
      const response = await fetch(
        `https://uitable-a55f7-default-rtdb.firebaseio.com/tableData.json?auth=${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            company,
            status,
            notes,
            ownerId: userId,
          }),
        }
      );
      const resData = await response.json();
      dispatch({
        type: ADD_MEMBER,
        member: {
          id : resData.name,
          name,
          company,
          status,
          notes,
          ownerId : userId
      } })
    }
    catch (err) {
      throw err;
    }
  }
}

export const deleteMember = (itemId) => {
  return async (dispatch,getState) => {
    const token = getState().token
    try {
      const response = await fetch(`https://uitable-a55f7-default-rtdb.firebaseio.com/tableData/${itemId}.json?auth=${token}`, {
        method : 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Something went wrong')
      }
      dispatch({type : DELETE_MEMBER, id : itemId})
    }
    catch (err) {
      throw err;
    }
  }
}