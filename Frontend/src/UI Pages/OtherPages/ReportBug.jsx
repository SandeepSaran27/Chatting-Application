import { useState } from "react";

function ReportError() {
    // State to hold the user's error report inputs
    const [reportData, setReportData] = useState({
        issueType: "Bug",
        description: "",
        stepsToReproduce: ""
    });

    // Mock function for handling the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Error Report Submitted:", reportData);
        alert("Thank you! Your error report has been submitted. (UI Only)");
        
        // Reset form after submission
        setReportData({
            issueType: "Bug",
            description: "",
            stepsToReproduce: ""
        });
    };

    return (
        <>
            <h1>Report an Error</h1>

            <div className="mainContainer">
                <form onSubmit={handleSubmit}>
                    
                    <div style={{ marginBottom: "15px" }}>
                        <p><b>Issue Type:</b></p>
                        <select 
                            value={reportData.issueType}
                            onChange={(e) => setReportData({ ...reportData, issueType: e.target.value })}
                            style={{ width: "100%", padding: "8px" }}
                        >
                            <option value="Bug">Bug / Glitch</option>
                            <option value="Payment">Payment / Wallet Issue</option>
                            <option value="UI">Display / UI Issue</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <p><b>Description of the Issue:</b></p>
                        <textarea 
                            rows="4" 
                            placeholder="What went wrong? e.g., 'I bought a stock but my wallet balance didn't update.'"
                            value={reportData.description}
                            onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
                            style={{ width: "100%", padding: "8px" }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "15px" }}>
                        <p><b>Steps to Reproduce (Optional):</b></p>
                        <textarea 
                            rows="3" 
                            placeholder="1. Go to dashboard&#10;2. Click on buy&#10;3. See error"
                            value={reportData.stepsToReproduce}
                            onChange={(e) => setReportData({ ...reportData, stepsToReproduce: e.target.value })}
                            style={{ width: "100%", padding: "8px" }}
                        />
                    </div>

                    <hr />

                    <button 
                        type="submit" 
                        style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#ff4d4f", color: "white", border: "none", borderRadius: "5px" }}
                    >
                        <b>Submit Report</b>
                    </button>

                </form>
            </div>
        </>
    );
}

export default ReportError;