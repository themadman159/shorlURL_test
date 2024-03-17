import axios from 'axios';
import React, { useEffect, useState } from 'react'
import QRCode from "react-qr-code";

function ResultURL(props: any) {

    const { inputValue } = props

    const [shortURL, setShortURL] = useState("")

    const fetchShortURL = ({ inputValue }: any) => {
        axios.post('https://api-ssl.bitly.com/v4/shorten', {
            "long_url": `https://${inputValue}`
        }, {
            headers: {
                'Authorization': `Bearer f6caa174a6a791b5adc0208097c635a7700d7ce4`,
            }
        })
            .then(res => {
                const shortURL = res.data.link;
                setShortURL(shortURL);

                // Now that you have the shortURL, make the API call to insert it into your database
                axios.put(
                    `${process.env.REACT_APP_API}/insert/shortURL`,
                    { shortURL }
                ).then(apiRes => {
                    console.log("Short URL inserted into database successfully:", apiRes);
                }).catch(apiErr => {
                    console.error("Error inserting short URL into database:", apiErr);
                });
            })
            .catch(error => {
                console.error('Error:', error.response.data); // Log detailed error information
            });
    };

    useEffect(() => {
        if (inputValue.length) {
            fetchShortURL({ inputValue })
        }
    }, [inputValue])

    return (
        <>
            <div className='text-center'>
                <a href={shortURL} target="_blank" rel="noopener noreferrer">
                {shortURL}
                </a>
            </div>
            <div className="flex justify-center my-2">
                {shortURL && <QRCode
                    size={256}
                    style={{ height: "auto", width: "150" }}
                    value={shortURL}
                    viewBox={`0 0 256 256`}
                />}
            </div>
        </>
    )
}

export default ResultURL