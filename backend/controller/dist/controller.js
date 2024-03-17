"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var conn = require('../../server');
//insert ข้อมูล ลงใน database
exports.insertData = function (req, res) {
    var _a = req.body, name = _a.name, fullURL = _a.fullURL, shortURL = _a.shortURL;
    // First query to insert user data
    conn.query("INSERT INTO user(user_name) VALUES ('".concat(name, "')"), function (err, userResult) {
        if (err) {
            console.error("Error inserting username into database:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        console.log("Username inserted into database successfully");
        // Retrieve the inserted user_id
        var userId = userResult.insertId;
        // Second query to insert URL data along with user_id
        conn.query("INSERT INTO history(full_URL, short_URL, date, user_id) VALUES ('".concat(fullURL, "', '").concat(shortURL, "', NOW(), '").concat(userId, "')"), function (err, historyResult) {
            if (err) {
                console.error("Error inserting URL into database:", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            console.log("URLs inserted into database successfully");
            // Update the short_URL for the newly inserted record
            conn.query("UPDATE history SET short_URL = '".concat(shortURL, "' WHERE history_id = ").concat(historyResult.insertId), function (updateErr, updateRes) {
                if (updateErr) {
                    console.error("Error updating short URL in database:", updateErr);
                    return res.status(500).json({ error: "Internal server error" });
                }
                console.log("Short URL updated successfully");
                // Send response after both queries have been executed
                return res.status(200).json({ message: "Insertion successful" });
            });
        });
    });
};
//ดึงข้อมูล
exports.getData = function (req, res) {
    conn.query("SELECT * FROM history INNER JOIN user ON history.user_id = user.user_id", function (err, result) {
        res.json(result);
    });
};
//อัพเดทจำนวนการเข้าดูเมื่อมีการกดลิงค์
exports.increviewCount = function (req, res) {
    var historyID = req.params.historyID;
    conn.query("UPDATE history SET view_count = view_count + 1 WHERE history_id = ".concat(historyID), function (err, result) {
        if (err) {
            console.error("Error updating view count:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        console.log("View count updated successfully");
        // Send response after updating the view count
        return res.status(200).json({ message: "View count updated successfully" });
    });
};
exports.insertShortURL = function (req, res) {
    var shortURL = req.body.shortURL;
    // Query to retrieve the latest history_id
    conn.query("SELECT MAX(history_id) AS latest_history_id FROM history", function (err, result) {
        if (err) {
            console.error("Error retrieving latest history_id:", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        var latestHistoryId = result[0].latest_history_id;
        // Update the shortURL for the latest history_id
        conn.query("UPDATE history SET short_URL = '".concat(shortURL, "' WHERE history_id = ").concat(latestHistoryId), function (updateErr, updateResult) {
            if (updateErr) {
                console.error("Error updating short URL:", updateErr);
                return res.status(500).json({ error: "Internal server error" });
            }
            console.log("Short URL updated successfully");
            return res.status(200).json({ message: "Short URL inserted successfully" });
        });
    });
};
