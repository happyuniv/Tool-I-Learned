import { useEffect, useState } from 'react'
import './Popup.css'
import { useCookies } from 'react-cookie'

export default function Popup() {
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [cookies, setCookie] = useCookies(['popup'])

  useEffect(() => {
    if (cookies['popup']) return
    else setOpen(true)
  }, [])

  const handleClose = () => {
    setOpen(false)
    if (checked) {
      const expires = new Date()
      expires.setDate(expires.getDate() + 1)
      setCookie('popup', 'true', { expires })
    }
  }

  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked)
  }

  return (
    <>
      {open && (
        <>
          <div className='backdrop' onClick={handleClose}></div>
          <div className='popup'>
            <h2 className='contents'>Popup Contents</h2>
            <div className='close'>
              <div>
                <input
                  className='check'
                  type='checkbox'
                  onChange={handleCheck}
                />
                <span>close for a day</span>
              </div>
              <button onClick={handleClose}>close</button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
