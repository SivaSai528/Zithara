import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Fetch = () => {
    const [cus, setCus] = useState([]);
    const [sortBy, setSortBy] = useState('date');
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(20);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {

        axios.get('http://localhost:3000/api/customers')
            .then(response => {
                console.log(response.data);
                setCus(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    };


    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };


    const sortedCustomers = [...cus].sort((a, b) => {
        
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);

        if (sortBy === 'date') {
            // Sort by date
            return dateA.getTime() - dateB.getTime();
        } else {
            // Sort by time
            const timeA = dateA.getHours() * 3600 + dateA.getMinutes() * 60 + dateA.getSeconds();
            const timeB = dateB.getHours() * 3600 + dateB.getMinutes() * 60 + dateB.getSeconds();
            return timeA - timeB;
        }
    });

    // Function to filter customers based on search query
    const filteredCustomers = sortedCustomers.filter(item =>
        item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Pagination
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredCustomers.slice(indexOfFirstRecord, indexOfLastRecord);

    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>
                Customer Data
            </h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3>
                 Search
            </h3>
            {/* Sorting options */}
            <select value={sortBy} onChange={handleSortChange}>
                <option value="date">Sort by Date</option>
                <option value="time">Sort by Time</option>
            </select> 

            {/* Search bar */}
            <input
                type="text"
                placeholder="Search by Name or Location..."
                value={searchQuery}
                onChange={handleSearchChange}
            /> 
            </div>

            {/* Display sorted and filtered customers in table format */}
            <table className="container">
                <thead className='container'>
                    <tr>
                        <th>Index</th>
                        <th>Customer Name</th>
                        <th>Age</th>
                        <th>Phone</th>
                        <th>Location</th>
                        <th>Date</th>
                        <th>Time</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((item, index) => {
                        // Create a new Date object from the created_at string
                        const createdAtDate = new Date(item.created_at);

                        // Extract date components
                        const year = createdAtDate.getFullYear();
                        const month = String(createdAtDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
                        const day = String(createdAtDate.getDate()).padStart(2, '0'); // Add leading zero if needed

                        // Extract time components
                        const hours = String(createdAtDate.getHours()).padStart(2, '0'); // Add leading zero if needed
                        const minutes = String(createdAtDate.getMinutes()).padStart(2, '0'); // Add leading zero if needed
                        const seconds = String(createdAtDate.getSeconds()).padStart(2, '0'); // Add leading zero if needed

                        // Construct formatted date and time strings
                        const formattedDate = `${year}-${month}-${day}`;
                        const formattedTime = `${hours}:${minutes}:${seconds}`;

                       
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item.customer_name}</td>
                                <td>{item.age}</td>
                                <td>{item.phone}</td>
                                <td>{item.location}</td>
                                <td>{formattedDate}</td>
                                <td>{formattedTime}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>



            {/* Pagination */}
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredCustomers.length / recordsPerPage) }, (_, i) => (
                    <button key={i} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default Fetch;

