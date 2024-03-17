import axios from 'axios'
import React, { useState } from 'react'

function Form(props: any) {

    const { setInputvalue } = props

    const [fullURL, setFullURL] = useState("")
    const [name, setName] = useState("")

    const submitform = (e: any) => {

        e.preventDefault()

        axios.post(
            `${process.env.REACT_APP_API}/insert`, { name, fullURL, URL }
        ).then((res => {
            console.log("save success");
        })).catch((err => {
            console.log(err);
        }))

        setInputvalue(fullURL)
        setName("")
        setFullURL("")
    }

    return (
        <>
            <div className='text-center justify-center '>
                <div>
                    <p className="text-4xl font-bold">URL shortener </p>
                </div>
                <div>
                    <p>กรอกชื่อผู้ใช้</p>
                    <input
                        className='border'
                        type="text"
                        placeholder='กรอกชื่อที่นี่'
                        value={name}
                        onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <p>กรอก URL ที่นี่</p>
                    <input
                        className='border'
                        type="text"
                        placeholder='กรอก URL ที่นี่'
                        value={fullURL}
                        onChange={(e) => setFullURL(e.target.value)} />
                </div>
                <button className='border px-5 my-3' onClick={submitform}>shorten</button>
            </div>
        </>
    )
}

export default Form