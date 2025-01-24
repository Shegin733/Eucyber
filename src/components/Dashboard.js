import React, { useEffect, useState } from "react";
import { Container, Typography, Box, List, ListItem, ListItemText, ListItemIcon, Link, Divider, IconButton, TextField, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faLightbulb, faUserTie, faPlus,faBell,faSearch ,faUserCircle} from '@fortawesome/free-solid-svg-icons';
import ApartmentIcon from '@mui/icons-material/Apartment';
import SettingsIcon from '@mui/icons-material/Settings';
import PieChartIcon from '@mui/icons-material/PieChart';
import { styled } from '@mui/material/styles';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import 'typeface-montserrat';
import 'typeface-poppins';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
// Configurable constants
const ICON_COLOR = "gray";
const HOVER_COLOR = "white";
const NAVBAR_WIDTH = "250px";
const CONTENT_MARGIN_LEFT = "280px";

const NavItem = ({ text, icon }) => (
  <ListItem 
    button 
    sx={{
      alignItems: 'center',
      fontFamily: 'poppins', // Apply Montserrat font
      '&:hover .MuiListItemIcon-root, &:hover .MuiListItemText-root': { color: HOVER_COLOR },
      '& .MuiListItemIcon-root': { color: ICON_COLOR },
      '& .MuiListItemText-root': { color: ICON_COLOR },
    }}
  >
    <ListItemIcon>
      {icon}
    </ListItemIcon>
    <ListItemText primary={text} />
  </ListItem>
);
// Navbar configuration
const navItems = [
  { text: "Overview", icon: <PieChartIcon /> },
  { text: "Reports", icon: <FontAwesomeIcon icon={faBook} /> },
  { text: "Properties", icon: <ApartmentIcon /> },
  { text: "Tasks", icon: <FontAwesomeIcon icon={faLightbulb} /> },
  { text: "Messages", icon: <FontAwesomeIcon icon={faUserTie} /> },
  { text: "Settings", icon: <SettingsIcon /> },
];
// State to manage chart type


// Reusable Card Component
const InfoCard = ({ title, children, sx }) => (
  <Box 
    sx={{
      flex: 1,
      padding: '10px',
      backgroundColor: '#f5f5f5',
      margin: '0 10px',
      textAlign: 'center',
      ...sx,
      fontFamily: 'poppins',
    }}
  >
    <Typography variant="h6"sx={{ fontFamily: 'poppins',}}>{title}</Typography>
    {children}
  </Box>
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [properties, setProperties] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', status: 'New' });
  const [newProperty, setNewProperty] = useState({ title: '', unit: '' });
  const [filter, setFilter] = useState('all');
  const [checkedTasks, setCheckedTasks] = useState({});
  const [dailyData, setDailyData] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [yearlyData, setYearlyData] = useState(null);
  const [chartType, setChartType] = useState('daily');
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [showAllTasks, setShowAllTasks] = useState(false);
  const [lowestConsumption, setLowestConsumption] = useState(null);
const [highestConsumption, setHighestConsumption] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date('2022-12-25'));
  const [selectedYear, setSelectedYear] = useState('2022'); // State to manage chart type
  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
  const [selectedMonth, setSelectedMonth] = useState('01');
  
  const handleMonthChange = (month) => {
    setSelectedMonth(month);
  };
  
  const API_KEY = "SC:ecyber:05ebe65104302aee";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://ecyber.lucyhq.com/Lucy/XPWorkSample/tasks", {
          method: "GET",
          headers: {
            "Authorization": `APIKEY ${API_KEY}`, // Dynamically include the API key
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        setTasks(data); // Update the tasks state with fetched data
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };
  
    fetchTasks();
  }, []);
  
  useEffect(() => {
    fetchPropertiesData();
  }, [chartType, selectedMonth, selectedYear]);

  const fetchPropertiesData = () => {
    let url = '';
    if (chartType === 'daily') {
      url = 'https://run.mocky.io/v3/f0e57825-e87d-4d86-a61f-c0922a9c431d';
    } else if (chartType === 'monthly') {
      url = `https://run.mocky.io/v3/bdd3aeac-48c4-4a19-9a9b-f77b48e1211e?month=${selectedMonth}`;
    } else if (chartType === 'yearly') {
      url = `https://run.mocky.io/v3/5ae9e294-975c-4faa-9fe9-58f474e866cd?year=${selectedYear}`;
    }

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const propertiesData = [
          { title: 'Property1', unit: calculateSum(data, 'Property1') },
          { title: 'Property2', unit: calculateSum(data, 'Property2') },
          { title: 'Property3', unit: calculateSum(data, 'Property3') },
        ];
        setProperties(propertiesData);
      })
      .catch((error) => console.error("Error fetching properties data:", error));
  };
  useEffect(() => {
    fetch("https://run.mocky.io/v3/f0e57825-e87d-4d86-a61f-c0922a9c431d")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched daily data:", data); // Log the fetched data
        setDailyData(data);
      })
      .catch((error) => console.error("Error fetching daily data:", error));
  }, []);
  
  useEffect(() => {
    let sums = [];
    if (chartType === 'daily' && dailyData) {
      sums = calculateHourlySums(dailyData);
    } else if (chartType === 'monthly' && monthlyData) {
      sums = calculateDailySums(monthlyData);
    } else if (chartType === 'yearly' && yearlyData) {
      sums = calculateMonthlySums(yearlyData);
    }
  
    if (sums.length > 0) {
      const { lowest, highest } = findLowestAndHighest(sums, chartType);
      setLowestConsumption(lowest);
      setHighestConsumption(highest);
    }
  }, [chartType, dailyData, monthlyData, yearlyData]);
  useEffect(() => {
    if (chartType === 'monthly') {
      fetchMonthlyData(selectedMonth);
    }
  }, [selectedMonth, chartType]);
  
  const fetchMonthlyData = (month) => {
    if (month !== '02') {
      setMonthlyData(null);
      console.log("No data available for the selected month");
      return;
    }
  
    const url = `https://run.mocky.io/v3/bdd3aeac-48c4-4a19-9a9b-f77b48e1211e`;
  
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched monthly data:", data); // Log the fetched data
        setMonthlyData(data);
      })
      .catch((error) => console.error("Error fetching monthly data:", error));
  };
  useEffect(() => {
    fetch("https://run.mocky.io/v3/5ae9e294-975c-4faa-9fe9-58f474e866cd")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched yearly data:", data); // Log the fetched data
        setYearlyData(data);
      })
      .catch((error) => console.error("Error fetching yearly data:", error));
  }, []);
  const calculateSum = (data, key) => {
    if (chartType === 'daily') {
        return Object.values(data.hourly_data).reduce((sum, item) => sum + (item[key] || 0), 0).toFixed(2);
    } else if (chartType === 'monthly') {
      return Object.values(data.monthly_data).reduce((sum, item) => sum + (item[key] || 0),0).toFixed(2);
    } else if (chartType === 'yearly') {
      return Object.values(data.yearly_data.monthly_data).reduce((sum, item) => sum + (item[key] || 0),0).toFixed(2);
    }
    return 0;
  };
  const calculateOverallSum = (properties) => {
    return properties.reduce((sum, property) => sum + parseFloat(property.unit), 0).toFixed(2);
  };
  
  const calculateAverage = (properties) => {
    return (properties.reduce((sum, property) => sum + parseFloat(property.unit), 0) / properties.length).toFixed(2);
  };
  const calculateHourlySums = (data) => {
    return Object.keys(data.hourly_data).map(hour => ({
      period: hour,
      sum: ['Property1', 'Property2', 'Property3'].reduce((sum, key) => sum + (data.hourly_data[hour][key] || 0), 0)
    }));
  };
  
  const calculateDailySums = (data) => {
    return Object.keys(data.monthly_data).map(day => ({
      period: day,
      sum: ['Property1', 'Property2', 'Property3'].reduce((sum, key) => sum + (data.monthly_data[day][key] || 0), 0)
    }));
  };
  
  const calculateMonthlySums = (data) => {
    return Object.keys(data.yearly_data.monthly_data).map(month => ({
      period: month,
      sum: ['Property1', 'Property2', 'Property3'].reduce((sum, key) => sum + (data.yearly_data.monthly_data[month][key] || 0), 0)
    }));
  };
  const formatPeriod = (period, type) => {
    if (type === 'daily') {
      return period.split('-').pop(); // Extract the hour
    } else if (type === 'monthly') {
      const month = period.split('-')[1]; // Extract the month
      const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      return monthNames[parseInt(month, 10) - 1]; // Convert month number to month name
    } else if (type === 'yearly') {
      return period.split('-')[0]; // Extract the year
    }
    return period;
  };
  
  const findLowestAndHighest = (sums, type) => {
    let lowest = sums[0];
    let highest = sums[0];
  
    sums.forEach(item => {
      if (item.sum < lowest.sum) lowest = item;
      if (item.sum > highest.sum) highest = item;
    });
  
    return {
      lowest: { ...lowest, period: formatPeriod(lowest.period, type) },
      highest: { ...highest, period: formatPeriod(highest.period, type) }
    };
  };

  const handleAddTask = () => {
    setTasks([{ ...newTask, time: new Date() }, ...tasks]);
    setNewTask({ title: '', status: 'New' });
    setShowTaskForm(false);
  };

  const handleAddProperty = () => {
    setProperties([{ ...newProperty }, ...properties]);
    setNewProperty({ title: '', unit: '' });
    setShowPropertyForm(false);
  };

  const handleCheckboxChange = (title) => {
    setCheckedTasks((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'New':
        return { backgroundColor: '#2ddfc1', color: 'white', borderRadius: '5px', padding: '2px 3px' };
      case 'Urgent':
        return { backgroundColor: '#FFB700', color: 'white', borderRadius: '5px', padding: '2px 3px' };
      default:
        return { backgroundColor: '#CCCCCC', color: 'white', borderRadius: '5px', padding: '2px 3px' };
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'priority') return task.status === 'Urgent' || task.status === 'New' || task.status === 'Default';
    if (filter === 'completed') return checkedTasks[task.title];
    if (filter === 'incomplete') return !checkedTasks[task.title];
    if (filter === 'latest') return true;
    return true;
  });

  const sortedTasks = filter === 'priority'
    ? filteredTasks.sort((a, b) => {
        const statusOrder = { 'Urgent': 1, 'New': 2, 'Default': 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      })
    : filter === 'latest'
    ? filteredTasks.sort((a, b) => {
        if (a.status === 'New' && b.status !== 'New') return -1;
        if (a.status !== 'New' && b.status === 'New') return 1;
        return new Date(b.time) - new Date(a.time);
      })
    : filteredTasks;

  const displayedTasks = showAllTasks ? sortedTasks : sortedTasks.slice(0, 3);
  const displayedProperties = showAllProperties ? properties : properties.slice(0, 3);
   // Define a custom styled checkbox
   const CustomCheckbox = styled('div')(({ theme, checked }) => ({
    width: '20px',
    height: '20px',
    marginRight: '15px',
    borderRadius: '50%',
    borderColor:'gray',
    border: `2px solid gray`,
    backgroundColor: checked ? 'blue' : 'transparent',
    display: 'inline-block',
    cursor: 'pointer',
  }));

  const getChartData = (type) => {
    let data = null;
    if (type === 'daily') data = dailyData;
    else if (type === 'monthly') data = monthlyData;
    else if (type === 'yearly') data = yearlyData;

    if (!data) return null;

    let labels = [];
    let datasets = [
      { label: 'Property1', data: [], borderColor: 'red', fill: false },
      { label: 'Property2', data: [], borderColor: 'blue', fill: false },
      { label: 'Property3', data: [], borderColor: 'green', fill: false },
    ];

    if (type === 'daily') {
      labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
      Object.keys(data.hourly_data).forEach((hour) => {
        datasets[0].data.push(data.hourly_data[hour].Property1);
        datasets[1].data.push(data.hourly_data[hour].Property2);
        datasets[2].data.push(data.hourly_data[hour].Property3);
      });
    } else if (type === 'monthly' && monthlyData) {
      labels = Array.from({ length: 28 }, (_, i) => `Day ${i + 1}`);
      Object.keys(data.monthly_data).forEach((day) => {
        datasets[0].data.push(data.monthly_data[day].Property1);
        datasets[1].data.push(data.monthly_data[day].Property2);
        datasets[2].data.push(data.monthly_data[day].Property3);
      });
    } else if (type === 'yearly') {
      labels = Object.keys(data.yearly_data.monthly_data);
      Object.keys(data.yearly_data.monthly_data).forEach((month) => {
        datasets[0].data.push(data.yearly_data.monthly_data[month].Property1);
        datasets[1].data.push(data.yearly_data.monthly_data[month].Property2);
        datasets[2].data.push(data.yearly_data.monthly_data[month].Property3);
      });
    }

    return { labels, datasets };
  };
  const ConsumptionSummary = ({ data, chartType }) => {
    if (!data) {
      return <Typography variant="h6"sx={{ fontFamily: 'poppins',}}>No data available</Typography>;
    }
  
    const calculateSum = (data, key) => {
      return Object.values(data).reduce((sum, item) => sum + (item.consumption[key] || 0), 0);
    };
  
    const elements = ['AC', 'Lightning', 'Lift', 'Pantry', 'Laptops/PCs/Phones'];

    return (
      <Box sx={{backgroundColor: 'white',
        height: '90%', // Make it equivalent to the height of the parent box
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // Space elements evenly from top to bottom
        padding: '16px',
        borderRadius: '8px',
        fontFamily: 'poppins',
          }}>
        
  {elements.map((element, index) => (
    <React.Fragment key={element}>
      <Box sx={{ alignItems:'center',textAlign:'center', marginTop: '8px' ,fontFamily: 'poppins',}}>
        <Typography variant="body1" sx={{ color: 'gray',fontFamily: 'poppins', }}>{element}</Typography>
        <Typography variant="body1" sx={{'fontSize':'23px',fontFamily: 'poppins', }}>
          {calculateSum(data, element)} kWh
        </Typography>
      </Box>
      {index < elements.length - 1 && <Divider sx={{ backgroundColor: '#CCCCCC', height: '1px', margin: '8px 0' ,fontFamily: 'poppins',}} />}
    </React.Fragment>
  ))}
</Box>
    );
  };
  const handleDateChange = (date) => {
    if (date.toISOString().split('T')[0] === '2022-12-25') {
      setSelectedDate(date);
    } else {
      alert('Data unavailable for the selected date');
    }
  };
  
  const handleYearChange = (year) => {
    if (year === '2022') {
      setSelectedYear(year);
    } else {
      alert('Data unavailable for the selected year');
    }
  };
  const commonBoxStyles = {
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '16px',
    borderRadius: '8px',
  };
  return (
    <Box sx={{ fontFamily: 'poppins',display: "flex", height: "100vh", fontFamily: 'Montserrat', overflow: "hidden" }}>
      {/* Navbar */}
      <Box
        sx={{
          width: NAVBAR_WIDTH,
          backgroundColor: "#363740",
          color: "gray",
          padding: "20px",
          flexShrink: 0,
          position: "fixed",
          top: "10%",
          bottom: "10%",
          marginLeft: "10px",
          fontFamily: 'poppins',
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontFamily: 'poppins',}}>
          Energy Management
        </Typography>
        <List  sx={{ fontFamily: 'poppins',}}>
          {navItems.map((item) => (
            <NavItem key={item.text} text={item.text} icon={item.icon} />
          ))}
        </List>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          marginLeft: CONTENT_MARGIN_LEFT,
          padding: "10% 20px",
          boxSizing: "border-box",
          overflowY: "auto",
          fontFamily: 'poppins',
        }}
      >
        {/* Header Row */}
  
        <Container>
            < Box sx={{backgroundColor: '#F3FDFE', padding: '20px', borderRadius: '8px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginBottom: '20px',fontFamily: 'poppins',}}>
            <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
      padding: "10px 20px",
      fontFamily: 'poppins',
      borderRadius: "8px",
  
    }}
  >
    {/* Check Property Box */}
    <Box sx={{ flexGrow: 1, textAlign: "center",width:'50px',paddingLeft:'30%',paddingRight:'10%',fontFamily: 'poppins', }}>
      <Typography variant="h6" sx={{...commonBoxStyles, fontWeight: "bold",fontFamily: 'poppins', }}>
        Choose Property
      </Typography>
    </Box>
    
    {/* Notification Icons */}
    <Box sx={{ display: "flex", alignItems: "center", gap: "15px",fontFamily: 'poppins', }}>
  {/* Messages Icon */}
  <Box>
    <FontAwesomeIcon icon={faSearch} style={{ fontSize: "19px", color: "grey",fontFamily: 'poppins', }} />
  </Box>

  {/* Notifications Icon */}
  <Box>
    <FontAwesomeIcon icon={faBell} style={{ fontSize: "19px", color: "grey",fontFamily: 'poppins', }} />
  </Box>
  {/* Vertical Divider */}
  <Box
  sx={{
    width: "1px",
    height: "24px",
    backgroundColor: "#ccc",
    margin: "0 150px 0 10px", 
    fontFamily: 'poppins',// Adds the desired spacing
  }}
></Box>



  {/* User Icon */}
  <Typography variant="h6" sx={{fontWeight: "bold",fontFamily: 'poppins', }}>User 1</Typography>
  <Box>
   
  <FontAwesomeIcon icon={faUserCircle} style={{ fontSize: "50px", color: "blue" }} />
  </Box>
  
</Box>
</Box> 


 
         {/* Info Cards Row */}
{/* Info Cards Row */}
{/* Info Cards Row */}
<Box sx={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', fontFamily: 'Poppins, sans-serif', backgroundColor: 'white' }}>
  <InfoCard 
    title="Overall kWh"  
    sx={{
      ...commonBoxStyles,
      fontFamily: 'Poppins, sans-serif',
      backgroundColor: 'white', // Set background color to white
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add box shadow
    }}
  >
    <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
      {calculateOverallSum(properties)} kWh
    </Typography>
  </InfoCard>
  
  <InfoCard 
    title="Average kWh"  
    sx={{
      fontFamily: 'Poppins, sans-serif',
      ...commonBoxStyles,
      backgroundColor: 'white', // Set background color to white
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add box shadow
    }}
  >
    <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
      {calculateAverage(properties)} kWh
    </Typography>
  </InfoCard>
  
  <InfoCard 
    title={`Lowest Consumption ${chartType === 'daily' ? 'Hour' : chartType === 'monthly' ? 'Day' : 'Month'}`}  
    sx={{
      fontFamily: 'Poppins, sans-serif',
      ...commonBoxStyles,
      backgroundColor: 'white', // Set background color to white
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add box shadow
    }}
  >
    <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
      {lowestConsumption ? `${lowestConsumption.period}` : 'N/A'}
    </Typography>
  </InfoCard>
  
  <InfoCard 
    title={`Highest Consumption ${chartType === 'daily' ? 'Hour' : chartType === 'monthly' ? 'Day' : 'Month'}`} 
    sx={{
      fontFamily: 'Poppins, sans-serif',
      ...commonBoxStyles,
      backgroundColor: 'white', // Set background color to white
      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add box shadow
    }}
  >
    <Typography variant="h6" sx={{ fontFamily: 'Poppins, sans-serif' }}>
      {highestConsumption ? `${highestConsumption.period}` : 'N/A'}
    </Typography>
  </InfoCard>
</Box>
     
{/* Line chart*/}
<InfoCard
      sx={{
        ...commonBoxStyles,
        height: "550px",
        backgroundColor: "white",
        padding: "16px",
        overflow: "hidden",
        textAlign: "left",
        display: "flex",
        flexDirection: "row",
        fontFamily: 'Montserrat, sans-serif', // Apply Montserrat font to the main container
      }}
    ><Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "70%",
          paddingLeft: "16px",
          fontFamily: 'Montserrat, sans-serif', // Apply Montserrat font
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            paddingBottom: "16px",
            fontFamily: 'Montserrat, sans-serif', // Apply Montserrat font
          }}
        >
          <Typography variant="h6" sx={{ fontFamily: 'Montserrat, sans-serif' }}>Total Current Consumption</Typography>
          {/* Chart Type Links */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              fontSize: "0.875rem",
              paddingTop: "10px",
              fontFamily: 'Montserrat, sans-serif', // Apply Montserrat font
            }}
          >
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setChartType("daily");
              }}
              sx={{
                color: chartType === "daily" ? "blue" : "inherit",
                textDecoration: "none",
                cursor: "pointer",
                marginRight: "16px",
                fontFamily: 'Montserrat, sans-serif', // Apply Montserrat font
              }}
            >
              Daily
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setChartType("monthly");
              }}
              sx={{
                color: chartType === "monthly" ? "blue" : "inherit",
                textDecoration: "none",
                cursor: "pointer",
                marginRight: "16px",
                fontFamily: 'Montserrat, sans-serif', // Apply Montserrat font
              }}
            >
              Monthly
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setChartType("yearly");
              }}
              sx={{
                color: chartType === "yearly" ? "blue" : "inherit",
                textDecoration: "none",
                cursor: "pointer",
                fontFamily: 'Montserrat, sans-serif', // Apply Montserrat font
              }}
            >
              Yearly
            </Link>
          </Box>

          {/* Legend and Filter Options */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
              paddingTop: "10px",
              fontFamily: 'Montserrat, sans-serif', // Apply Montserrat font
            }}
          >
            {/* Filter Options */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {chartType === "daily" && (
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="yyyy-MM-dd"
                  customInput={<TextField label="Select Date" />}
                />
              )}
              {chartType === "monthly" && (
                <FormControl sx={{ minWidth: 120, marginLeft: "16px" }}>
                  <InputLabel>Month</InputLabel>
                  <Select
                    value={selectedMonth}
                    onChange={(e) => handleMonthChange(e.target.value)}
                  >
                    {months.map((month) => (
                      <MenuItem key={month.value} value={month.value}>
                        {month.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {chartType === "yearly" && (
                <FormControl sx={{ minWidth: 120, marginLeft: "16px" }}>
                  <InputLabel>Year</InputLabel>
                  <Select
                    value={selectedYear}
                    onChange={(e) => handleYearChange(e.target.value)}
                  >
                    <MenuItem value="2019">2019</MenuItem>
                    <MenuItem value="2020">2020</MenuItem>
                    <MenuItem value="2021">2021</MenuItem>
                    <MenuItem value="2022">2022</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>

            {/* Custom Legend */}
            <Box sx={{ display: "flex", alignItems: "center", marginLeft: "16px" }}>
              {getChartData(chartType)?.datasets.map((dataset, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", marginLeft: "16px", paddingRight: "16px" }}>
                  <span style={{
                    display: 'inline-block',
                    width: '20px', // Width of the line
                    height: '2px', // Height of the line
                    backgroundColor: dataset.borderColor, // Line color
                    marginRight: '8px' // Space between line and label
                  }}></span>
                  <span>{dataset.label}</span>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Line Chart */}
        <Box
          sx={{
            overflow: "auto",
            height: "100%", // Take remaining vertical space
            width: "100%", // Full width of the parent
            flexGrow: 1, // Allow it to grow and fill space
          }}
        >
          {getChartData(chartType) && (
            <Line
              data={getChartData(chartType)}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false, // Disable the default legend
                  },
                  title: {
                    display: true,
                    text: `${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Consumption`,
                  },
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                  y: {
                    position: "right",
                    title: {
                      display: true,
                      text: "kWh",
                    },
                    grid: {
                      drawOnChartArea: true,
                      drawBorder: false,
                    },
                    ticks: {
                      stepSize: 100,
                    },
                  },
                },
                elements: {
                  line: {
                    borderWidth: 2,
                  },
                  point: {
                    radius: 0,
                  },
                },
              }}
            />
          )}
        </Box>
      </Box>

      {/* Second Box: Consumption Summary */}
      <Box
        sx={{
          width: "30%", // Allocate 30% of the width
          height: "100%", // Match height of the parent container
          display: "flex",
          flexDirection: "column",
          backgroundColor: "white",
          padding: "0", // Remove padding to allow full height
          borderRadius: "8px",
          boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
          overflow: "hidden", // Prevent overflow
        }}
      >
        <ConsumptionSummary
          data={
            chartType === "daily"
              ? dailyData?.hourly_data
              : chartType === "monthly"
              ? monthlyData?.monthly_data
              : yearlyData?.yearly_data?.monthly_data
          }
          chartType={chartType}
          sx={{
            flexGrow: 1, // Ensures the content fills the allocated space
            overflowY: "auto", // Scroll if content overflows
            height: "100%", // Ensure it takes full height
          }}
        />
      </Box>
    </InfoCard>

  
          {/* Properties and Tasks Row */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between',marginTop: '20px',fontFamily: 'poppins', }}>
            <InfoCard sx={{ ...commonBoxStyles,height: '300px', overflowY: 'auto', position: 'relative', paddingTop: '5px',fontFamily: 'poppins', }}>
              <Box sx={{ padding: '5px' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',fontFamily: 'poppins', }}>
                  <Typography variant="h6" sx={{ textAlign: 'left', fontSize: '1.25rem',fontFamily: 'poppins', }}>Properties</Typography>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAllProperties(!showAllProperties);
                    }}
                    sx={{ color: 'blue', marginRight: '10px', fontSize: '1.1rem',fontFamily: 'poppins' }}
                  >
                    {showAllProperties ? 'Show less' : 'View all'}
                  </Link>
                </Box>
                <Typography variant="subtitle1" sx={{ textAlign: 'left', fontSize: '.8rem', marginTop: '8px',fontFamily: 'poppins'}}>Overview {chartType.charAt(0).toUpperCase() + chartType.slice(1)}</Typography>
                <List>
                  {properties.map((property, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',fontFamily: 'poppins',marginBottom:'0%' }}>
                        <Typography variant="body1">{property.title}</Typography>
                        <Typography variant="body2" sx={{ marginLeft: '8px', color: 'gray',fontFamily: 'poppins', }}>{property.unit} kWh</Typography>
                        </ListItem>
                      {index < properties.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                  <React.Fragment>
                    <ListItem sx={{ display: 'flex', justifyContent: 'space-between',fontFamily: 'poppins', }}>
                      <ListItemText primary="Create New Property" />
                      <IconButton
                        onClick={() => setShowPropertyForm(!showPropertyForm)}
                        sx={{ backgroundColor: '#EEEEEE', color: 'gray', borderRadius: '100%', padding: '4px', fontSize: '16px',fontFamily: 'poppins', }}
                      >
                      
                        <FontAwesomeIcon icon={faPlus} />
                      </IconButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                </List>
                {/* Form for adding new property */}
                {showPropertyForm && (
                  <Box sx={{ marginTop: '20px',fontFamily: 'poppins', }}>
                    <TextField
                      label="Property Title"
                      value={newProperty.title}
                      onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })}
                      fullWidth
                      sx={{ marginBottom: '10px' ,fontFamily: 'poppins',}}
                    />
                    <TextField
                      label="Unit"
                      type="number"
                      value={newProperty.unit}
                      onChange={(e) => setNewProperty({ ...newProperty, unit: e.target.value })}
                      fullWidth
                      sx={{ marginBottom: '10px' ,fontFamily: 'poppins',}}
                    />
                    <Button variant="contained" color="primary" onClick={handleAddProperty}>
                      Add Property
                    </Button>
                  </Box>
                )}
              </Box>
            </InfoCard>
            <InfoCard sx={{...commonBoxStyles, height: '300px', overflowY: 'auto', position: 'relative', paddingTop: '2px',fontFamily: 'poppins', }}>
              <Box sx={{ padding: '2px',fontFamily: 'poppins', }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',fontFamily: 'poppins', }}>
                  <Typography variant="h6" sx={{ textAlign: 'left', fontSize: '1.25rem' ,fontFamily: 'poppins',}}>Tasks</Typography>
                  <Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowAllTasks(!showAllTasks);
                    }}
                    sx={{ color: 'blue', marginRight: '10px', fontSize: '1.1rem' ,fontFamily: 'poppins',}}
                  >
                    {showAllTasks ? 'Show less' : 'View all'}
                  </Link>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px',fontFamily: 'poppins', }}>
                  <Typography variant="subtitle1" sx={{ textAlign: 'left', fontSize: '.8rem', textDecorationColor: 'GrayText' ,fontFamily:'poppins'}}>Today</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center',fontFamily: 'poppins', }}>
                    <Typography variant="subtitle1" sx={{ marginRight: '8px' ,fontFamily: 'poppins',fontSize:'.8rem'}}>Filter</Typography>
                    <FormControl sx={{ minWidth: 80, height: 10, padding: 0 ,fontFamily: 'poppins',fontSize:'.8rem'}}>
                      <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        sx={{ height: '20px', padding: '0 8px',fontFamily: 'poppins', fontSize:'.8rem'}} // Adjust padding to reduce height
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="incomplete">Incomplete</MenuItem>
                        <MenuItem value="latest">Latest</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
                <List>
                  <React.Fragment>
                    <ListItem sx={{ display: 'flex', justifyContent: 'space-between',fontFamily: 'poppins', }}>
                      <ListItemText primary="Create New Task" sx={{fontFamily: 'poppins'}} />
                      <IconButton
                        onClick={() => setShowTaskForm(!showTaskForm)}
                        sx={{ backgroundColor: '#EEEEEE', color: 'gray', borderRadius: '100%', padding: '4px', fontSize: '16px',fontFamily: 'poppins', }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </IconButton>
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                  {showTaskForm && (
                    <Box sx={{ marginTop: '20px',fontFamily: 'poppins', }}>
                      <TextField
                        label="Task Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        fullWidth
                        sx={{ marginBottom: '10px' }}
                      />
                      <FormControl fullWidth sx={{ marginBottom: '10px',fontFamily: 'poppins', }}>
                        <InputLabel>Status</InputLabel>
                        <Select
                          value={newTask.status}
                          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                        >
                          <MenuItem value="New">New</MenuItem>
                          <MenuItem value="Urgent">Urgent</MenuItem>
                          <MenuItem value="Default">Default</MenuItem>
                        </Select>
                      </FormControl>
                      <Button variant="contained" color="primary" onClick={handleAddTask}>
                        Add Task
                      </Button>
                    </Box>
                  )}
                  {displayedTasks.map((task, index) => (
                    <React.Fragment key={index}>
                      <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',fontFamily: 'poppins', }}>
                        <CustomCheckbox
                          checked={!!checkedTasks[task.title]}
                          onClick={() => handleCheckboxChange(task.title)}
                        />
                        <ListItemText primary={task.title} />
                        <Typography variant="body2" sx={{ ...getStatusStyle(task.status), textTransform: 'uppercase' }}>
                          {task.status}
                        </Typography>
                      </ListItem>
                      {index < displayedTasks.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              </Box>
            </InfoCard>
          </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Dashboard;
