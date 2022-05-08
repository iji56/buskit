import React, {useState, useEffect, useRef} from 'react';
import {
  ScrollView,
  Text,
  Image,
  View,
  TouchableOpacity,
  Dimensions,
  AsyncStorage,
  SafeAreaView,
} from 'react-native';
import styles from './styles';
import Fonts from '../../Res/Fonts';
import Colors from '../../Res/Colors';
import Strings from '../../Res/String';
import Moment from 'moment';

import CustomStatusBar from '../../Components/CustomStatusBar';
import commonStyles from '../../Res/Styles';
import {DotIndicator} from 'react-native-indicators';
import Toast, {DURATION} from 'react-native-easy-toast';
import {timeout, processResponse} from '../../Config/CommonFunctions';
import constants from '../../Config/Constants';

import {Calendar, Agenda} from 'react-native-calendars';
import EventCalendar from 'react-native-events-calendar';
import DayView from 'react-native-events-calendar/src/DayView';

const {width} = Dimensions.get('window');

const BuskerSchedule = props => {
  const {buskerId, buskerName} = props.route.params;
  const [user, setUser] = useState('');
  const [day, setDay] = useState(new Date());
  const [month, setMonth] = useState(new Date());
  const [year, setYear] = useState(new Date());
  const [oldDates, setOldDates] = useState({});
  const [markedDates, setMarkedDates] = useState({});
  const [events, setEvents] = useState([]);

  const [isLoading, setLoading] = useState(false);
  const toast = useRef(null);

  useEffect(() => {
    // Preload data using AsyncStorage
    AsyncStorage.getItem('UserDetails', (err, result) => {
      if (err === null) {
        let res = JSON.parse(result);
        setUser(res);
        MonthEventsApi(res, new Date());
        DateEventsApi(res, new Date());
      }
    });
    // setDay(Moment(new Date()).format('YYYY-MM-DD'));
    // setMonth(Moment(new Date()).format('YYYY-MM-DD'));
    // setYear(Moment(new Date()).format('YYYY'));
    // let dateList = {
    //   '2020-10-16': {marked: true},
    //   '2020-10-19': {marked: true},
    // };
  }, []);

  //******************** Hit month events Api *******************
  const MonthEventsApi = async (data, date) => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.monthyEvents);
    console.log('month data', Moment(date).format('MM YYYY'));
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.monthyEvents +
          '?busker_id=' +
          buskerId +
          '&month=' +
          Moment(date).format('MM') +
          '&year=' +
          Moment(date).format('YYYY'),
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      ),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            // let current = Moment(day).format('YYYY-MM-DD');
            // if (Object.keys(data).includes(current)) {
            //   data[current].selected = true;
            // } else {
            //   data[current] = {
            //     selected: true,
            //   };
            // }
            setMarkedDates(data);
            setOldDates(data);
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  //******************** Hit month events Api *******************
  const DateEventsApi = async (data, date) => {
    setLoading(true);
    console.log('ApiCall', constants.baseUrl + constants.api.dateEventDetails);
    console.log('date data', Moment(date).format('YYYY-MM-DD'));
    timeout(
      10000,
      fetch(
        constants.baseUrl +
          constants.api.dateEventDetails +
          '?busker_id=' +
          buskerId +
          '&date=' +
          Moment(date).format('YYYY-MM-DD'),
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            //'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.access_token}`,
          },
        },
      ),
    )
      .then(processResponse)
      .then(res => {
        const {responseCode, responseJson} = res;
        console.log(
          'response',
          responseCode + '' + JSON.stringify(responseJson),
        );
        setLoading(false);
        if (responseCode === 200) {
          if (responseJson.success == 'true') {
            var data = responseJson.data;
            setEvents([]);
            if (data.length != 0) {
              makeEventData(data);
            }
          } else {
            toast.current.show(responseJson.message, 2000, () => {});
          }
        } else {
          if (responseJson.hasOwnProperty('message')) {
            toast.current.show(responseJson.message, 2000, () => {});
          } else {
            var key;
            var secondKey;
            for (var k in responseJson) {
              key = k;
              break;
            }
            for (var k in responseJson[key]) {
              secondKey = k;
              break;
            }
            toast.current.show(responseJson[key][secondKey][0], 2000, () => {});
          }
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
        toast.current.show(err.message, 2000, () => {});
      });
  };

  const makeEventData = data => {
    let eventList = [];
    data.forEach(element => {
      let object = {
        start: element.event_date + ' ' + element.start_time,
        end: element.event_date + ' ' + element.end_time,
        title: element.event_name,
        summary: element.address,
      };
      eventList.push(object);
    });
    setEvents(eventList);
  };

  //functiuon for month change
  const setMonthChange = date => {
    MonthEventsApi(user, date);
  };

  // function for select day
  const setSelectedDay = date => {
    let newDate = markedDates;

    if (Object.keys(oldDates).includes(date)) {
      console.warn('new date selected/marked');
      newDate[date] = {
        selected: true,
        marked: true,
      };
      if (Object.keys(oldDates).includes(day)) {
        console.warn('temp old--->', day);
        newDate[day] = {
          selected: false,
          marked: true,
        };
      } else {
        console.warn('temp old else--->', day);
        newDate[day] = {
          selected: false,
          marked: false,
        };
      }
    } else {
      console.warn('new date selected/unmarked');
      newDate[date] = {
        selected: true,
        marked: false,
      };
      if (Object.keys(oldDates).includes(day)) {
        console.warn('temp new--->', day);
        if (newDate[day].marked) {
          newDate[day] = {
            selected: false,
            marked: true,
          };
        } else {
          newDate[day] = {
            selected: false,
            marked: false,
          };
        }
      } else {
        console.warn('temp new else--->', day);
        newDate[day] = {
          selected: false,
          marked: false,
        };
      }
    }
    setMarkedDates({...markedDates, ...newDate});
    DateEventsApi(user, date);
  };

  return (
    <SafeAreaView style={styles.viewcontainer}>
      <CustomStatusBar color={Colors.theme} />
      <View style={styles.headerRowStyle}>
        <TouchableOpacity
          style={styles.backImageBack}
          onPress={() => {
            props.navigation.goBack();
          }}>
          <Image
            style={styles.backImageStyle}
            resizeMode={'contain'}
            source={require('../../Assets/Images/back.png')}
          />
        </TouchableOpacity>
        <Text style={styles.titleText}>{buskerName}</Text>
        <TouchableOpacity style={styles.backImageBack} />
      </View>
      {/* Calendar View */}
      <View style={styles.viewStyle}>
        <Calendar
          theme={{
            selectedDayBackgroundColor: Colors.black,
            textSectionTitleColor: '#b6c1cd',
          }}
          // Initially visible month. Default = Date()
          current={new Date()}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={new Date(Date.now() - 31556926000)}
          // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          maxDate={new Date(Date.now() + 31556926000)}
          // Handler which gets executed on day press. Default = undefined
          onDayPress={day => {
            console.log('selected day', day);
            setDay(day.dateString);
            setSelectedDay(day.dateString);
          }}
          // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
          monthFormat={'MM yyyy'}
          // Handler which gets executed when visible month changes in calendar. Default = undefined
          onMonthChange={month => {
            console.log('month changed', month);
            setMonth(month.dateString);
            setYear(month.year);
            setMonthChange(month.dateString);
          }}
          // Replace default arrows with custom ones (direction can be 'left' or 'right')
          //renderArrow={direction => <Arrow />}
          // Do not show days of other months in month page. Default = false
          hideExtraDays={true}
          // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
          firstDay={1}
          // Handler which gets executed when press arrow icon left. It receive a callback can go back month
          onPressArrowLeft={subtractMonth => subtractMonth()}
          // Handler which gets executed when press arrow icon right. It receive a callback can go next month
          onPressArrowRight={addMonth => addMonth()}
          // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
          disableAllTouchEventsForDisabledDays={true}
          /** Replace default month and year title with custom one. the function receive a date as parameter. */
          renderHeader={date => {
            /*Return JSX*/
            console.log('Data--->', date);
            return <View />;
          }}
          markingType={'simple'}
          markedDates={markedDates}
        />
        <Text style={styles.calendarHeader}>
          {Moment(month).format('MMM YYYY')}
        </Text>

        {/* Event Time View */}
        <View style={styles.viewStyle}>
          <Text style={styles.eventHeader}>{Moment(day).format('MMM DD')}</Text>
          {events.length != 0 && (
            <EventCalendar
              eventTapped={data => console.log('data', data)}
              events={events}
              width={width}
              scrollToFirst={true}
              virtualizedListProps={{scrollEnabled: false}}
              initDate={Moment(day).format('YYYY-MM-DD hh:mm:ss')}
              formatHeader={'MMM DD'}
              styles={{header: {height: 0, opacity: 0}}}
            />
          )}
          {events.length == 0 && (
            <View style={styles.emptyView}>
              <Image
                style={styles.ImageStyle}
                resizeMode={'contain'}
                source={require('../../Assets/Images/app_logo.png')}
              />
              <Text style={styles.EmptyText}>{'No Events'}</Text>
            </View>
          )}
        </View>
      </View>

      {/* <TouchableOpacity
            style={styles.btnContainer}
            activeOpacity={0.5}
            onPress={() => {}}>
            <Text style={styles.btnText}>
              {I18n.t('busker.confirm_booking')}
            </Text>
          </TouchableOpacity> */}
      {/* </View> */}
      <Toast
        ref={toast}
        style={commonStyles.toastStyle}
        textStyle={commonStyles.toastTextStyle}
      />
      {isLoading && (
        <View style={commonStyles.loaderStyle}>
          <DotIndicator color={Colors.theme} size={15} count={4} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default BuskerSchedule;
