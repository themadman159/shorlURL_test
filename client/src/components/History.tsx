import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'

function History() {

    //สร้าง state เก็บข้อมูลบันทึกย้อนหลัง
    const [history, setHistory] = useState<HistoryItem[]>([])

    const increViewCount = (historyID: number) => {
        axios.put(`${process.env.REACT_APP_API}/insert/increviewCount/${historyID}`)
            .then((res) => {
                console.log(res);
                // Update local state after successful response
                setHistory(prevHistory => {
                    return prevHistory.map(item => {
                        if (item.history_id === historyID) {
                            // Increment view_count for the specific item
                            return { ...item, view_count: item.view_count + 1 };
                        }
                        return item;
                    });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    //สร้าง func fetch ข้อมูล
    const fetchData = () => {
        axios.get(
            `${process.env.REACT_APP_API}/data`
        ).then(respone => {
            setHistory(respone.data)
        }).catch(err => {
            alert(err)
        })
    }

    //ดึงข้่อมูลตอนเปิด
    useEffect(() => {
        fetchData()
    }, [])

    interface HistoryItem {
        history_id: number,
        user_id: number,
        date: Date,
        full_URL: string,
        short_URL: string,
        view_count: number,
        user_name: string
    }

    return (
        <>
            <div className="text-center justify-center flex">
                <table>
                    <tr>
                        <td>ชื่อผู้ใช้งาน</td>
                        <td>FULL URL</td>
                        <td>Shorten URL</td>
                        <td>จำนวนการเข้าชม</td>
                    </tr>

                    {history.map((item: HistoryItem) => (
                        <tr>
                            <td>
                                {item.user_name}
                            </td>
                            <td>
                                {item.full_URL}
                            </td>
                            <td>
                                <a
                                    href={item.short_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => { increViewCount(item.history_id) }}
                                >
                                    {item.short_URL}
                                </a>
                            </td>
                            <td>
                                {item.view_count}
                            </td>
                        </tr>
                    ))}

                </table>
            </div>
        </>
    )
}

export default History