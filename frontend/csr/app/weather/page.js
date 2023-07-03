import styles from './page.module.css'
import { redirect } from 'next/navigation';
import DynamicWall from '../(components)/DynamicWall';
import CurrentWidget from './(widgets)/CurrentWidget';
import DailyWidget from './(widgets)/DailyWidget';
import WeeklyWidget from './(widgets)/WeeklyWidget';
import { Dosis } from '@next/font/google';

export const dynamic='force-dynamic';

const font = Dosis({
    subsets: ['latin'],
    weight: ['400']
});

const hashCodes = [
  [0, {desc: "Clear Sky", anim: "day.svg"}],
  [1, {desc: "Mostly Clear", anim: "cloudy-day-1.svg"}],
  [2, {desc: "Partly Cloudy", anim: "cloudy-day-2.svg"}],
  [3, {desc: "Overcast", anim: "cloudy-day-3.svg"}],
  [45, {desc: "Fog", anim: "cloudy-day-1.svg"}],
  [48, {desc: "Depositing Rime Fog", anim: "cloudy-day-1.svg"}],
  [51, {desc: "Light Drizzle", anim: "rainy-2.svg"}],
  [53, {desc: "Moderate Drizzle", anim: "rainy-1.svg"}],
  [55, {desc: "Severe Drizzle", anim: "rainy-3.svg"}],
  [56, {desc: "Freezing Light Drizzle", anim: "rainy-4.svg"}],
  [57, {desc: "Freezing Severe Drizzle", anim: "rainy-5.svg"}],
  [61, {desc: "Slight Rain", anim: "rainy-4.svg"}],
  [63, {desc: "Moderate Rain", anim: "rainy-5.svg"}],
  [65, {desc: "Heavy Rain", anim: "rainy-6.svg"}],
  [66, {desc: "Freezing Light Rain", anim: "rainy-5.svg"}],
  [67, {desc: "Freezing Heavy Rain", anim: "rainy-6.svg"}],
  [71, {desc: "Slight Snow Fall", anim: "snowy-2.svg"}],
  [73, {desc: "Moderate Snow Fall", anim: "snowy-1.svg"}],
  [75, {desc: "Heavy Snow Fall", anim: "snowy-3.svg"}],
  [77, {desc: "Snow Grains", anim: "snowy-4.svg"}],
  [80, {desc: "Light Showers", anim: "rainy-5.svg"}],
  [81, {desc: "Moderate Showers", anim: "rainy-6.svg"}],
  [82, {desc: "Violent Showers", anim: "rainy-7.svg"}],
  [85, {desc: "Light Snow Showers", anim: "snowy-5.svg"}],
  [86, {desc: "Heavy Snow Showers", anim: "snowy-6.svg"}],
  [95, {desc: "Thunderstorm", anim: "thunder.svg"}],
  [96, {desc: "Light Hail Thunderstorm", anim: "thunder.svg"}],
  [99, {desc: "Severe Hail Thunderstorm", anim: "thunder.svg"}]
];

const weatherCode = new Map(hashCodes);

export default async function page({searchParams})
{
  var id = searchParams.id;
  var label;
  var initialProps;
  var finalProps;

  if (!id)
  {
    redirect('/');
  }

  initialProps = await instateInitialProps(id);
  label = initialProps.name + ', ' + initialProps.admin1;
  finalProps = await instateFinalProps(initialProps.latitude, initialProps.longitude, initialProps.timezone);

  return (
    <>
      <DynamicWall />

      <div className={styles.page_header_wrapper}><label className={styles.page_header + ' ' + font.className}>{label}</label></div>
      <CurrentWidget props={parseCurrentProps(finalProps)} />
      <DailyWidget props={label} />
      <WeeklyWidget props={label} />
    </> 
  );
}

const instateInitialProps = async (id) => {
  const worker = await fetch('https://geocoding-api.open-meteo.com/v1/get?id=' + id);
  const data = await worker.json();

  if (data.error)
  {
    redirect('/');
  }
  
  return data;
}

const instateFinalProps = async (lat, lon, tz) => {
  const worker = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&timezone=' + tz + '&current_weather=true&temperature_unit=fahrenheit&hourly=temperature_2m,weathercode');
  const data = await worker.json();

  return data;
}

const parseCurrentProps = (obj) => {
  return {
    'lat': obj.latitude,
    'lon': obj.longitude,
    'desc': weatherCode.get(obj.current_weather.weathercode).desc,
    'svg': dayOrNight(weatherCode.get(obj.current_weather.weathercode).anim, obj.current_weather.is_day),
    'temp': obj.current_weather.temperature,
    'unit': obj.hourly_units.temperature_2m,
    'time': getTime(obj.current_weather.time),
  };
}

const dayOrNight = (string, isDay) => {
  if (isDay == 0)
  {
    return string.replace('day', 'night');
  }

  return string;
}

const getTime = (context) => {
  var date = new Date(); date.setHours(date.getHours() + ((new Date(context)).getUTCHours() - 10));
  return date.toLocaleString([], { hour: 'numeric', minute: 'numeric', hour12: true });
}