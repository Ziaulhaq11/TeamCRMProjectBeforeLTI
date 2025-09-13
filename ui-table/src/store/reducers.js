import Member from "../models/member";
import { ADD_MEMBER, SET_MEMBERS,AUTHENTICATE, DELETE_MEMBER } from "./actions";

const initialState = {
  availableMembers: [],
  token: null,
  userId : null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case AUTHENTICATE: 
      return {...state,token : action.token, userId : action.userId}
    case SET_MEMBERS:
      let newState = action.members;
      return {...state, availableMembers : newState}
    case ADD_MEMBER:
      let member = action.member
      let newMember = new Member(member.id, member.ownerId, member.name, member.company, member.status, member.notes)
      let members = [...state.availableMembers ]
      members.push(newMember)
      return {
        ...state,
        availableMembers : members
      }
    case DELETE_MEMBER:
      return {
        ...state,
        availableMembers : state.availableMembers.filter(member => member.id !== action.id)
      }
  }
  return state;
}