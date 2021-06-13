import { useState, useEffect, ChangeEvent } from "react"

const ACCOUNTS_TYPE = 'accounts'
const LOADING = 'loading'
const LOADED = 'loaded'

const divWrapperStyle = {
  backgroundColor: '#F7F7F7',
  margin: '0 auto',
  padding: '10px',
  width: '35%'
}

const listStyle = {
  padding: '0px'
}

const listItemStyle = {
  borderBottom: '1px solid black',
  listStyleType: 'none',
  padding: '10px'
}

const inputStyle = {
  width: '90%'
}

const buttonStyle = {
  width: '10%'
}

type Entity = {
  id: string
  type: string
  attributes?: {
    name: string
    ['Job Level']: string
  },
  relationships?: {
    account: {
      data: {
        type: string
        id: string
      }
    }
  }
}

export const Dropdown = () => {
  const [managers, setManagers] = useState<any>({})  
  const [managerIds, setManagerIds] = useState<any>([])
  const [searchResults, setSearchResults] = useState<any>([])
  const [state, setState] = useState(LOADING)
  const [inputFocus, setInputFocus] = useState(false)

  useEffect(() => {
    fetch('https://gist.githubusercontent.com/daviferreira/41238222ac31fe36348544ee1d4a9a5e/raw/5dc996407f6c9a6630bfcec56eee22d4bc54b518/employees.json')
      .then((res) => res.json())
      .then(values => {
        // "data" - contains employee data
        // "included" - contains employee data as well as accounts data that allow us to extract email addresses to match the design
        const { data, included } = values

        const accounts = getAccounts(included)        

        const managersInData = data.filter(isEmployeeAManager)
        const managersInIncluded = included.filter(isEmployeeAManager)

        const managerEntitiesList = [ ...managersInData, ...managersInIncluded].map((entity: Entity) => {
          const relationshipType = entity?.relationships?.account?.data?.type
          const relationshipId = entity?.relationships?.account?.data?.id

          let email = null

          if (relationshipType === ACCOUNTS_TYPE && relationshipId) {            
            email = accounts[relationshipId]?.email            
          }

          return [entity.id, { name: entity?.attributes?.name, email }] 
        })

        const managerEntities = Object.fromEntries(managerEntitiesList)
        const managerEntitiesIds = Object.keys(managerEntities)     

        setManagers(managerEntities)
        setManagerIds(managerEntitiesIds)
        setSearchResults(managerEntitiesIds)
        setState(LOADED)
      })
  }, [])
  
  const isEmployeeAManager = (employee: Entity) => {    
    return employee.attributes && employee.attributes['Job Level'] && employee.attributes['Job Level'].toLowerCase().includes('manager')
  }

  const getAccounts = (data: any) => {
    const entries = data
      .filter((entity: any) => entity.type === ACCOUNTS_TYPE)
      .map((entity: any) => ([ entity.id, { email: entity.attributes.email } ]))

    return Object.fromEntries(entries)
  }

  const handleChange = (e: ChangeEvent) => {
    const { value } = e.target as HTMLInputElement    

    // if no input set to original list of managerIds
    if (!value) {      
      return setSearchResults(managerIds)
    }

    const res = managerIds.filter((id: string) => managers[id].name.toLowerCase().split(' ').join('').includes(value))

    setSearchResults(res)
  }
  
  const handleFocus = () => {    
    setInputFocus(true)     
  }
  
  const handleBlur = () => {
    setInputFocus(false)
  }
  
  const renderList = () => {
    if (inputFocus) {      
      return (
        <ul style={listStyle}>
        {
          searchResults.map((id: string) => {
            return <li key={id} style={listItemStyle}>
              <div>
                <div>{managers[id].name}</div>
                <div>{managers[id].email}</div>
              </div>
            </li>
          })
        }
        </ul>
      )
    }
  }

  const renderSearchBox = () => {
    return (
      <div>
        <input style={inputStyle} placeholder="Select Manager" onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} />
        { inputFocus === true && <button style={buttonStyle}>&#9650;</button> }
        { inputFocus === false && <button style={buttonStyle}>&#9660;</button> }
      </div>
    )
  }

  return (
    <div style={divWrapperStyle}>
      <p>Manager</p>
      { state === LOADING && <div>Loading ...</div> }
      { state === LOADED && 
        <div>
          { renderSearchBox() }
          { renderList() }
        </div>
      }
    </div>
  )
}
