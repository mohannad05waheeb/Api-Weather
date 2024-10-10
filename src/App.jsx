import './App.css';
import { createTheme, ThemeProvider } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import moment from "moment"; 
import { useTranslation } from 'react-i18next';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CloudIcon from '@mui/icons-material/Cloud';
import Button from '@mui/material/Button'; 
const theme = createTheme({ 
  typography: {
    fontFamily: ['IBM']
  }
});
function App() { 
  const { t, i18n } = useTranslation();
  const [dateAndTime , setDateAndTime] = useState('');  
  const [temp, setTemp] = useState({
    number: null,
    description: '',
    min: null,
    max: null,
    icon: null,      
  });
  const [locale , setLocale] = useState("ar");  
  const direction = locale === 'ar' ? 'rtl' : 'ltr';
  function handleLanguageClick() {
    if (locale === "en") {
      setLocale("ar")     
      i18n.changeLanguage("ar");  
    } else {
      setLocale("en")
      i18n.changeLanguage("en");    
    }   
  }
  useEffect(() => {
    i18n.changeLanguage("ar");
  }, []);
  useEffect(() => {   
    setDateAndTime(moment().format("MMMM Do YYYY, h:mm:ss a"));
    const controller = new AbortController(); 
    axios.get('https://api.openweathermap.org/data/2.5/weather?lat=34.19&lon=31.0883&appid=d63a1642fd526431fe5ca5219b3592df', {
      signal: controller.signal  
    })
    .then(function (response) {
      const responseTemp = Math.round(response.data.main.temp - 272.15);
      const min =  Math.round(response.data.main.temp_min - 272.15);
      const max = Math.round(response.data.main.temp_max - 272.15);
      const description = response.data.weather[0].description;
      const responseIcon = response.data.weather[0].icon;
      setTemp({
        number: responseTemp,
        min: min,
        max: max,
        description: description,
        icon: `https://openweathermap.org/img/wn/${responseIcon}@2x.png`, 
      });
    })
    .catch(function (error) {
      if (axios.isCancel(error)) {
        console.log("Request canceled", error.message);
      } else {
        console.error("Error:", error);
      }
    });
    return () => {
      controller.abort(); 
    };
  }, []);
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Container maxWidth="sm">
          <div style={{ 
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center', 
            flexDirection: 'column'
            }}>
            <div style={{
              width: '100%',
              backgroundColor: 'rgb(28 52 91 / 36%)',
              color: 'white', 
              padding: '10px',
              borderRadius: '15px',
              boxShadow: '0px 11px 1px rgba(0,0,0,0.05)'
              }}
              dir={direction} 
              >
              <div>
                <div style={{ 
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'start',
                  marginBottom: '10px'
                  }}
                  dir={direction} 
                  >
                  <Typography variant="h3" style={{ 
                  marginRight: '20px',
                  fontWeight: '600' 
                }}
                > {t('Baltim')}                                                  
                  </Typography>
                  <Typography variant="h5" style={{ marginRight: '20px' }}>
                    {dateAndTime}                 
                   </Typography> 
                </div>
                <hr />
                <div style={{
                  display: 'flex', 
                  justifyContent: 'space-around' 
                  }}
                  >
                  <div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                    <Typography variant="h1" style={{ textAlign: 'right' }}>
                       {temp.number}
                    </Typography>
                    <img src={temp.icon} />
                    </div>
                    <Typography variant="h6" style={{ textAlign: 'center' }}>
                        {t(temp.description)}
                    </Typography>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h5>{t('min')}: {temp.min}</h5>
                      <h5 style={{ margin: '0px 5px' }}>|</h5>
                      <h5>{t("max")}: {temp.max}</h5>
                    </div>
                  </div>
                  <CloudIcon style={{ fontSize: '200px' }} />
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'end',
              width: '100%',
              marginTop: '20px'
              }} 
             dir={direction}
             >
              <Button variant="text" style={{ color: 'white' }} onClick={handleLanguageClick}>
                {locale === "en" ? "Arabic" : "انجليزي"}
              </Button>
            </div>
          </div>
        </Container>
      </ThemeProvider>
    </div>
  );
}
export default App;