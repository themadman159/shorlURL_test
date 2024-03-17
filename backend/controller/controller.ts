import { error, log } from "console";
import { Request, Response } from "express";
import { json } from "stream/consumers";

const conn = require('../server')

//insert ข้อมูล ลงใน database
exports.insertData = (req: Request, res: Response) => {
    const { name, fullURL, shortURL } = req.body;

    // First query to insert user data
    conn.query(
        `INSERT INTO user(user_name) VALUES ('${name}')`,
        (err: any, userResult: any) => {
            if (err) {
                console.error("Error inserting username into database:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            console.log("Username inserted into database successfully");

            // Retrieve the inserted user_id
            const userId = userResult.insertId;

            // Second query to insert URL data along with user_id
            conn.query(
                `INSERT INTO history(view_count, full_URL, short_URL, date, user_id) VALUES ( 0, '${fullURL}', '${shortURL}', NOW(), '${userId}')`,
                (err: any, historyResult: any) => {
                    if (err) {
                        console.error("Error inserting URL into database:", err);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    console.log("URLs inserted into database successfully");

                    // Update the short_URL for the newly inserted record
                    conn.query(
                        `UPDATE history SET short_URL = '${shortURL}' WHERE history_id = ${historyResult.insertId}`,
                        (updateErr: any, updateRes: any) => {
                            if (updateErr) {
                                console.error("Error updating short URL in database:", updateErr);
                                return res.status(500).json({ error: "Internal server error" });
                            }
                            console.log("Short URL updated successfully");

                            // Send response after both queries have been executed
                            return res.status(200).json({ message: "Insertion successful" });
                        }
                    );
                }
            );
        }
    );
};

//ดึงข้อมูล
exports.getData = (req: Request, res: Response) => {
    conn.query(
        "SELECT * FROM history INNER JOIN user ON history.user_id = user.user_id",
        (err: any, result: any) => {
            res.json(result)
        })
}

//อัพเดทจำนวนการเข้าดูเมื่อมีการกดลิงค์
exports.increviewCount = (req: Request, res: Response) => {

    const { historyID } = req.params

    conn.query(
        `UPDATE history SET view_count = view_count + 1 WHERE history_id = ${historyID}`,
        (err: any, result: any) => {
            if (err) {
                console.error("Error updating view count:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            console.log("View count updated successfully");

            // Send response after updating the view count
            return res.status(200).json({ message: "View count updated successfully" });
        }
    );
}

exports.insertShortURL = (req: Request, res: Response) => {

    const { shortURL } = req.body;

    // Query to retrieve the latest history_id
    conn.query(
        "SELECT MAX(history_id) AS latest_history_id FROM history",
        (err: any, result: any) => {
            if (err) {
                console.error("Error retrieving latest history_id:", err);
                return res.status(500).json({ error: "Internal server error" });
            }

            const latestHistoryId = result[0].latest_history_id;

            // Update the shortURL for the latest history_id
            conn.query(
                `UPDATE history SET short_URL = '${shortURL}' WHERE history_id = ${latestHistoryId}`,
                (updateErr: any, updateResult: any) => {
                    if (updateErr) {
                        console.error("Error updating short URL:", updateErr);
                        return res.status(500).json({ error: "Internal server error" });
                    }

                    console.log("Short URL updated successfully");
                    return res.status(200).json({ message: "Short URL inserted successfully" });
                }
            );
        }
    );

}