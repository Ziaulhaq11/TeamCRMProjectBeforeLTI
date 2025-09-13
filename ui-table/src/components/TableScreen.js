import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { addMember, authenticate, deleteMember, fetchMembers } from '../store/actions'
import '../css/TableScreen.css'
const TableScreen = () => {
  
  const dispatch = useDispatch()
  const members = useSelector(st => st.availableMembers)
  const [keys,setKeys] = useState([])
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  const [all,setAll] = useState(true)
  const [showCompanies,setShowCompanies] = useState(false)
  const [tableData, setTableData] = useState({
    name: "",
    company: "",
    status: "Active",
    notes: ''
  })
  const [sortedField, setSortedField] = useState(null)
  const [companies, setCompanies] = useState([])
  const { name, company, status, notes } = tableData
  const sortedMembers = [...members]
  if (sortedField !== null) {
    sortedMembers.sort((a, b) => {
      var x = a.status.toLowerCase()
      var y = b.status.toLowerCase()
      return x < y ? -1 : 0;
    })
  }

  if (members.length > 0 && companies.length === 0) {
    let copy = {}
    members.map(member => {
      let company = member.company
      copy[company] = true;
    })
    setCompanies({ ...copy })
  }

  console.log(companies)

  if (keys.length === 0 && Object.keys(companies).length > 0) {
    setKeys(Object.keys(companies))
  }

  const getProducts = async () => {
    const userId = user.uid
    const token = user.stsTokenManager.accessToken
    dispatch(authenticate(userId, token))
    dispatch(fetchMembers())
  }

  useEffect(() => {
    if (!user) {
      return navigate('/login')
    }
    getProducts()
  }, [])

  const handleData = (data) => e => {
    e.preventDefault()
    setTableData({ ...tableData, [data]: e.target.value })
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    setTableData({
      name: "",
      company: "",
      status: "Active",
      notes: ""
    })
    dispatch(addMember(name, company, status, notes))
  }

  const deleteHandler = (id, name) => {
    dispatch(deleteMember(id))
    // window.location.reload()
  }

  const checkHandler = (value, name) => {
    if (name === 'all' && value === true) {
      let copy = { ...companies }
      keys.map(key => {
        copy[key] = false
      })
      setCompanies(copy)
      setAll(false)
    }
    else if (name === 'all' && value === false) {
      let copy = { ...companies }
      keys.map(key => {
        copy[key] = true
      })
      setCompanies(copy)
      setAll(true)
    }
    else if (value === true) {
      let copy = { ...companies }
      copy[name] = false
      setCompanies(copy)
    }
    else if (value === false) {
      let copy = { ...companies }
      copy[name] = true
      setCompanies(copy)
    }
  }


  return (
    <div className='main'>
      <div className="sub-main">
        <div className="header">
          <h1>Team Members</h1>
          <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#addMember">
            Add Member
          </button>
        </div>
        <div className="header-1">
          <div >
            <h5 className="sub sub-1" onClick={() => setShowCompanies(!showCompanies)}>Company ^</h5>
            {showCompanies && <div className="checkbox2" >
              <div className="checkboxes">
                <input type="checkbox" value='company' checked={all} className='form-check-input' onChange={() => checkHandler(all, 'all')} />
                <label htmlFor="company" className='form-check-label' >Select All</label>
              </div>
              {keys.map(company => (
                <div className="checkboxes">
                  <input type="checkbox" value={company} key={company} checked={companies[company]} onChange={() => checkHandler(companies[company], company)} className='form-check-input' />
                  <label htmlFor={company} className='form-check-label'>{company}</label>
                </div>
              ))}
            </div >}
          </div>
          <div>
            <h5 className="sub sub-2" onClick={() => setSortedField('status')}>Status ^</h5>

          </div>
        </div>
        <div className="header-2">
          <table id="members">
            <thead>
              <tr>
                <th><input type="checkbox" name="head" className='checkbox' /></th>
                <th>Name</th>
                <th>Company</th>
                <th>Status</th>
                <th>Notes</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>

              {sortedMembers.map(member => {
                if (companies[member.company] === true) {
                  return (
                    <tr key={member.id}>
                      <td><input type="checkbox" name="head" className='checkbox' /></td>
                      <td>{member.name}</td>
                      <td>{member.company}</td>
                      <td>{member.status}</td>
                      <td>{member.notes}</td>
                      <td><div onClick={() => deleteHandler(member.id, member.name)}><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z" />
                        <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z" />
                      </svg></div></td>
                    </tr>
                  )
                  
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="modal fade" id="addMember" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">Add Member</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <h4>Add Members</h4>
              <form>
                <label className='form-label '>Name</label>
                <input type="text" className='form-control' value={name} onChange={handleData('name')} />
                <label className='form-label '>Company</label>
                <input type="text" className='form-control' value={company} onChange={handleData('company')} />
                <label className='form-label '>Status</label>
                <select name="status" id="" className='form-select' onChange={handleData('status')}>
                  <option value={status} defaultValue>Active </option>
                  <option value="Closed">Closed</option>
                </select>
                <label className='form-label '>Notes</label>
                <input type="text" className='form-control' value={notes} onChange={handleData('notes')} />
              </form>
              <div className='buttonContainer'>
                <button className='btn btn-warning' data-bs-dismiss="modal" aria-label="Close">Close</button>
                <button className='btn btn-primary' onClick={submitHandler}>Submit</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TableScreen

