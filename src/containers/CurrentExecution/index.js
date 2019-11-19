import React from 'react';
import { FaRegChartBar } from "react-icons/fa";
import axios from 'axios';

import { PagePadding, ChartWrapper, PanelBody, TableWrapper, GridWidth, FlexItem, InfoCard } from './styles';

import Card from '../../components/custom/Card';
import Panel from '../../components/custom/Panel';
import PieUI from '../../Charts/PieChart';

class CurrentExecution extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openedPanel: 'overall',
      overallData: {},
      moduleData: {}
    }
  }

  callAPI = () => {
    return axios
      .get('https://9q39nyqwpa.execute-api.ap-southeast-2.amazonaws.com/Prod/requestManager/liveResult?moduleName=%27Health%27')
      .then(res => res)
  }

  changedOpenedPanel = (text) => {
    const { openedPanel } = this.state;
    if (text === openedPanel) {
      this.setState({
        openedPanel: ''
      })
    } else {
      this.setState({
        openedPanel: text
      })
    }
  }

  getCard = (title, value, bgColor, icon) => {
    return (
      <Card title={title} value={value} bgColor={bgColor} Icon={icon} />
    )
  }

  getTotalCardUI = () => {
    const { overallData } = this.state;
    let { testCount, moduleCount, scenarioCount } = overallData;
    let data = [
      {
        title: "Total Modules",
        value: moduleCount,
        bgColor: '#00acac'
      },
      {
        title: "Total Scenarios",
        value: scenarioCount
      },
      {
        title: "Total Testcases",
        value: testCount,
        bgColor: '#a667e0'
      },
      {
        title: "Avg Execution Time",
        value: "00 hr 33 min",
        bgColor: '#00000052',
        icon: FaRegChartBar
      }
    ]
    return (
      <div>
        {
          data.map((obj, index) => (
            this.getCard(obj.title, obj.value, obj.bgColor, obj.icon)
          ))
        }
      </div>
    )
  }

  getChartPanel = (title, data, label) => {
    let colors = ['#66c16a', '#ff5b57']
    let dataSets = [
      {
        data: data,
        backgroundColor: colors
      }
    ]
    return (
      <Panel title={title}>
        <PanelBody>
          <PieUI datasets={dataSets} label={label} height={200} />
        </PanelBody>
      </Panel>
    )
  }

  getGridUI = (index, obj) => (
    <GridWidth width={obj.width} bgColor={obj.bgColor} key={index} noPadding={obj.noPadding}>
      {obj.title}
    </GridWidth>
  )

  getInformationUI = (index, obj) => {
    return (
      <InfoCard key={index}>
        <div className="card-title">
          <div>
            {obj.title}
          </div>
        </div>
        <div className="card-value">
          <div>
            {obj.value}
          </div>
        </div>
      </InfoCard>
    )
  }

  getTableHeader = (width, title, bgColor, noPadding) => {
    return { width, title, bgColor, noPadding };
  }

  getTableUI = (moduleTable, scenarioTable, testcaseTable, infoArr) => {
    let header = [
      this.getTableHeader('7.5%', '', ''),
      this.getTableHeader('7.5%', 'Pass Count', '#ff5b57'),
      this.getTableHeader('7.5%', 'Fail Count', '#66c16a'),
      this.getTableHeader('7.5%', 'Total Count', '#92d3de'),
      this.getTableHeader('10%', 'Pass Percentage', '#ff5b57'),
      this.getTableHeader('10%', 'Fail Percentage', '#66c16a'),
      this.getTableHeader('12.5%', 'Start Date & Time', '#92d3de', true),
      this.getTableHeader('12.5%', 'End Date & Time', '#92d3de', true),
      this.getTableHeader('12.5%', 'Total Duration', '#92d3de', true), 
      this.getTableHeader('12.5%', 'Average Execution Time', '#92d3de', true)
    ];

    let modulusData = moduleTable ? [...moduleTable] : [];
    let scanarioData = scenarioTable ? [...scenarioTable] : [];
    let testData = testcaseTable ? [...testcaseTable] : [];
    let InfoData = infoArr ? [...infoArr] : [];

    return (
      <ChartWrapper>
        <TableWrapper>
          {/* <FlexItem justifyCon='space-around' wrap={1}>
            {InfoData.map((obj, index) => (
              this.getInformationUI(`info-${index}`, obj)
            ))}
          </FlexItem> */}
          <div className="half">
            <FlexItem >
              {header.map((obj, index) => (
                this.getGridUI(`header-${index}`, obj)
              ))}
            </FlexItem>
            {modulusData.length > 0 &&
              <FlexItem >
                {modulusData.map((obj, index) => (
                  this.getGridUI(`header-${index}`, obj)
                ))}
              </FlexItem>
            }
            <FlexItem >
              {scanarioData.map((obj, index) => (
                this.getGridUI(`header-${index}`, obj)
              ))}
            </FlexItem>
            <FlexItem >
              {testData.map((obj, index) => (
                this.getGridUI(`header-${index}`, obj)
              ))}
            </FlexItem>
          </div>
          {/* <div className="half">
            <FlexItem >
              {secondHeader.map((obj, index) => (
                this.getGridUI(`header-${index}`, obj)
              ))}
            </FlexItem>
            <FlexItem>

            </FlexItem>
          </div> */}
        </TableWrapper>
      </ChartWrapper>
    )
  }

  makeInfoArr = (startDate, endDate, Duration, avgExecTime) => {
    let arr = [
      {
        title: 'Start Date & Time',
        value: startDate
      },
      {
        title: 'End Date & Time',
        value: endDate
      },
      {
        title: 'Total Duration',
        value: Duration
      },
      {
        title: 'Average Execution Time',
        value: avgExecTime
      }
    ]
    return arr;
  }

  commonUI = (title, panelText, data, noModule) => {
    const { openedPanel } = this.state;
    let { moduleCount, modulesPassCount, scenarioCount, scenarioPassCOunt, testCount, testPassCount, startDate, endDate } = data;

    let overallChartData = !noModule  ? [
      this.makeChartObj('Modulus', moduleCount || 0, modulesPassCount || 0),
      this.makeChartObj('Scenarios', scenarioCount || 0, scenarioPassCOunt || 0),
      this.makeChartObj('Testcases', testCount || 0, testPassCount || 0)
    ] : [
      this.makeChartObj('Scenarios', scenarioCount || 0, scenarioPassCOunt || 0),
      this.makeChartObj('Testcases', testCount || 0, testPassCount || 0)
    ];

    let moduleData = { 
      totalCount: moduleCount, 
      passCount: modulesPassCount 
    }

    let scenarioData = { 
      totalCount: scenarioCount, 
      passCount: scenarioPassCOunt, 
      startDate: '11/10/2019', 
      endDate: '14/11/2019', 
      duration: '10 hrs 10 mins',
      avgExecTime: '5 hrs 5 mins'
    }

    let testData = { 
      totalCount: testCount, 
      passCount: testPassCount 
    }

    let moduleTable = this.tableMaker('Modules', '#ffff2de8', moduleData);
    let scenarioTable = this.tableMaker('Scenario', '#92d3de', scenarioData);
    let testcaseTable = this.tableMaker('Test Cases', '#c1bdbd', testData)
    let infoArr = this.makeInfoArr(startDate, endDate, '', '')
    let chartData = [...overallChartData];

    return (
      <Panel title={title} onClick={this.changedOpenedPanel} id={panelText}>
        {openedPanel === panelText &&
          <ChartWrapper length={chartData.length}>
            {chartData.map((obj, index) => (
              <div key={index} className="chartWidth">
                {this.getChartPanel(obj.title, obj.data, obj.label)}
              </div>
            ))}
          </ChartWrapper>
        }
        {openedPanel === panelText && this.getTableUI(!noModule ? moduleTable : [], scenarioTable, testcaseTable, infoArr)}
      </Panel>
    )
  }

  getOverallExecutionUI = () => {
    const { overallData } = this.state;
    return this.commonUI('Overall execution status', 'overall', overallData);
  }

  getModuleDashboard = () => {
    const { moduleData } = this.state;
    let arr = [];
    Object.keys(moduleData).forEach((key) => {
      let title = `Module Name: ${moduleData[key].moduleName}`;
      let id = moduleData[key].moduleName;
      arr.push(<div className="mt">
        {this.commonUI(title, id, moduleData[key], true)}
      </div>)
    })
    return arr;
  }

  tableMaker = (name, bgColor, obj) => {
    let pass = obj.passCount;
    let fail = obj.totalCount - obj.passCount
    let arr = [
      this.getTableHeader('7.5%', name, bgColor),
      this.getTableHeader('7.5%', pass, '#ff5b57'),
      this.getTableHeader('7.5%', fail, '#66c16a'),
      this.getTableHeader('7.5%', obj.totalCount, '#92d3de'),
      this.getTableHeader('10%', this.getPercentage(obj.totalCount, pass), '#ff5b57'),
      this.getTableHeader('10%', this.getPercentage(obj.totalCount, fail), '#66c16a'),
      this.getTableHeader('12.5%', obj.startDate ? obj.startDate : '', '#c1bdbd', true),
      this.getTableHeader('12.5%', obj.endDate ? obj.endDate : '', '#c1bdbd', true),
      this.getTableHeader('12.5%', obj.duration ? obj.duration : '', '#c1bdbd', true),
      this.getTableHeader('12.5%', obj.avgExecTime ? obj.avgExecTime : '', '#c1bdbd', true),
    ];
    return arr;
  }

  getPercentage = (total, value) => {
    return ((value / total) * 100).toFixed(2);
  }

  makeChartObj = (name, totalCount, passCount) => {
    let pass = passCount;
    let fail = totalCount - pass;
    let obj = {
      title: name,
      data: [pass, fail],
      label: [`${this.getPercentage(totalCount, pass)}% Pass`, `${this.getPercentage(totalCount, fail)}% Fail`]
    }
    return obj;
  }

  componentDidMount() {
    // let checkAPI = this.callAPI();
    // console.log(checkAPI)
    let data = { "totalCount": 104, "liveResults": [{ "id": 1, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 20222", "moduleName": "Health", "scenarioName": "Single", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 15938", "testCaseEndTime": "2/01/2019 20221", "status": "PASS" }, { "id": 2, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 30222", "moduleName": "Travel", "scenarioName": "Single", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 25938", "testCaseEndTime": "2/01/2019 30221", "status": "PASS" }, { "id": 3, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 40222", "moduleName": "Life", "scenarioName": "10Years", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 35938", "testCaseEndTime": "2/01/2019 40221", "status": "PASS" }, { "id": 4, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 50222", "moduleName": "Member", "scenarioName": "Fresh", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 45938", "testCaseEndTime": "2/01/2019 50221", "status": "PASS" }, { "id": 5, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 60222", "moduleName": "Corporate", "scenarioName": "IBM", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 55938", "testCaseEndTime": "2/01/2019 60221", "status": "PASS" }, { "id": 6, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 70222", "moduleName": "Car", "scenarioName": "Hachback", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 65938", "testCaseEndTime": "2/01/2019 70221", "status": "PASS" }, { "id": 7, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 80222", "moduleName": "Bike", "scenarioName": "100cc", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 75938", "testCaseEndTime": "2/01/2019 80221", "status": "PASS" }, { "id": 8, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 90222", "moduleName": "Cycle", "scenarioName": "Hero", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 85938", "testCaseEndTime": "2/01/2019 90221", "status": "PASS" }, { "id": 9, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 100222", "moduleName": "Aircraft", "scenarioName": "DoubleDacker", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 95938", "testCaseEndTime": "2/01/2019 100221", "status": "PASS" }, { "id": 10, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 110222", "moduleName": "Ship", "scenarioName": "SingleTurbine", "testCaseId": "TestCase-1", "testCaseStartTime": "2/01/2019 105938", "testCaseEndTime": "2/01/2019 110221", "status": "PASS" }, { "id": 11, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 120222", "moduleName": "Health", "scenarioName": "Single", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 115938", "testCaseEndTime": "2/01/2019 120221", "status": "PASS" }, { "id": 12, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 130222", "moduleName": "Travel", "scenarioName": "Single", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 125938", "testCaseEndTime": "2/01/2019 130221", "status": "PASS" }, { "id": 13, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 140222", "moduleName": "Life", "scenarioName": "10Years", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 135938", "testCaseEndTime": "2/01/2019 140221", "status": "PASS" }, { "id": 14, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 150222", "moduleName": "Member", "scenarioName": "Fresh", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 145938", "testCaseEndTime": "2/01/2019 150221", "status": "PASS" }, { "id": 15, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 160222", "moduleName": "Corporate", "scenarioName": "IBM", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 155938", "testCaseEndTime": "2/01/2019 160221", "status": "PASS" }, { "id": 16, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 170222", "moduleName": "Car", "scenarioName": "Hachback", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 165938", "testCaseEndTime": "2/01/2019 170221", "status": "PASS" }, { "id": 17, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 180222", "moduleName": "Bike", "scenarioName": "100cc", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 175938", "testCaseEndTime": "2/01/2019 180221", "status": "PASS" }, { "id": 18, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 190222", "moduleName": "Cycle", "scenarioName": "Hero", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 185938", "testCaseEndTime": "2/01/2019 190221", "status": "PASS" }, { "id": 19, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 200222", "moduleName": "Aircraft", "scenarioName": "DoubleDacker", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 195938", "testCaseEndTime": "2/01/2019 200221", "status": "PASS" }, { "id": 20, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 210222", "moduleName": "Ship", "scenarioName": "SingleTurbine", "testCaseId": "TestCase-2", "testCaseStartTime": "2/01/2019 205938", "testCaseEndTime": "2/01/2019 210221", "status": "PASS" }, { "id": 21, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 220222", "moduleName": "Health", "scenarioName": "Single", "testCaseId": "TestCase-3", "testCaseStartTime": "2/01/2019 215938", "testCaseEndTime": "2/01/2019 220221", "status": "PASS" }, { "id": 22, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 230222", "moduleName": "Travel", "scenarioName": "Single", "testCaseId": "TestCase-3", "testCaseStartTime": "2/01/2019 225938", "testCaseEndTime": "2/01/2019 230221", "status": "PASS" }, { "id": 23, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 00222", "moduleName": "Life", "scenarioName": "10Years", "testCaseId": "TestCase-3", "testCaseStartTime": "2/01/2019 235938", "testCaseEndTime": "2/01/2019 00221", "status": "PASS" }, { "id": 24, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 10222", "moduleName": "Member", "scenarioName": "Fresh", "testCaseId": "TestCase-3", "testCaseStartTime": "2/01/2019 05938", "testCaseEndTime": "2/01/2019 10221", "status": "PASS" }, { "id": 25, "runId": 1, "projectName": "demoBUPA", "companyName": "ADC", "timeStamp": "2/01/2019 20222", "moduleName": "Corporate", "scenarioName": "IBM", "testCaseId": "TestCase-3", "testCaseStartTime": "2/01/2019 15938", "testCaseEndTime": "2/01/2019 20221", "status": "Fail" }] }
    let apiData = this.reduceData(data.liveResults);
    this.setState({
      overallData: apiData.overallData,
      moduleData: apiData.moduleData
    })
  }

  reduceData = (data) => {
    let obj = {};
    let moduleCount = 0;
    let scenarioCount = 0;
    let testCount = 0;
    let testPassCount = 0;
    let startDate = '';
    let endDate = '';
    for (let i = 0; i < data.length; i++) {

      /**Overall Start Time */
      if (startDate === '') {
        startDate = data[i].testCaseStartTime;
      } else if (startDate > data[i].testCaseStartTime) {
        startDate = data[i].testCaseStartTime;
      }

      /**Overall End Time */
      if (endDate === '') {
        endDate = data[i].testCaseEndTime;
      } else if (endDate < data[i].testCaseEndTime) {
        endDate = data[i].testCaseEndTime;
      }

      /**Overall Test Pass Count */
      if (data[i].status !== 'Fail') {
        testPassCount += 1;
      }

      if (obj[data[i].moduleName] && obj[data[i].moduleName].data) {
        obj[data[i].moduleName].testCount += 1;
        if (data[i].status !== 'Fail') {
          obj[data[i].moduleName].testPassCount += 1;
        }

        obj[data[i].moduleName].data.push(data[i]);
        let getscenarioIndex = obj[data[i].moduleName].scanarios.findIndex((a) => a.name === data[i].scenarioName)
        if (getscenarioIndex === -1) {
          let scenarioObj = {
            name: data[i].scenarioName,
            failedTest: data[i].status === 'Fail' ? 1 : 0,
            total: 1
          }
          obj[data[i].moduleName].scanarios.push(scenarioObj)
        } else {
          obj[data[i].moduleName].scanarios[getscenarioIndex].total += 1;
          if (data[i].status === 'Fail') {
            obj[data[i].moduleName].scanarios[getscenarioIndex].failedTest += 1
          }
        }

        if (data[i].status === 'Fail') {
          obj[data[i].moduleName].overallStatus = 'fail';
          obj[data[i].moduleName].overallTestFailed += 1;
        }
      } else {
        obj[data[i].moduleName] = {
          moduleName: data[i].moduleName,
          data: [data[i]],
          testCount: 1,
          testPassCount: data[i].status === 'Fail' ? 0 : 1,
          scanarios: [{
            name: data[i].scenarioName,
            failedTest: data[i].status === 'Fail' ? 1 : 0,
            total: 1
          }],
          overallTestFailed: data[i].status === 'Fail' ? 1 : 0,
          overallStatus: data[i].status === 'Fail' ? 'fail' : 'pass',
        }
      }
    }

    testCount = data.length;
    let modulesPassCount = 0;
    let scenarioPassCOunt = 0;
    let apiObj = {};
    Object.keys(obj).forEach(function (key) {
      let moduleObj = obj[key];
      moduleCount += 1;
      moduleObj['scenarioCount'] = moduleObj.scanarios.length;
      moduleObj['scenarioPassCOunt'] = 0;
      for (let i = 0; i < moduleObj.scanarios.length; i++) {
        scenarioCount += 1;
        if (moduleObj.scanarios[i].failedTest === 0) {
          scenarioPassCOunt += 1;
          moduleObj['scenarioPassCOunt'] += 1;
        }
      }
      moduleObj['moduleCount'] = 1;
      moduleObj['modulesPassCount'] = 0;
      if (moduleObj.overallStatus !== 'fail') {
        modulesPassCount += 1;
        moduleObj['modulesPassCount'] = 1
      }
      apiObj[key] = { ...moduleObj };
    });

    let overallData = {
      moduleCount,
      modulesPassCount,
      scenarioCount,
      scenarioPassCOunt,
      testCount,
      testPassCount,
      startDate,
      endDate
    }

    return { moduleData: apiObj, overallData };
  }

  render() {
    return (
      <PagePadding>
        <div className="title">Current Execution</div>
        {this.getTotalCardUI()}
        {this.getOverallExecutionUI()}
        {this.getModuleDashboard()}
        {/* <div className="mt">
          {this.getHealthPanelUI()}
        </div>
        <div className="mt">
          {this.getTravelPanelUI()}
        </div>
        <div className="mt">
          {this.getLifePanelUI()}
        </div> */}
      </PagePadding>
    );
  }
}

export default CurrentExecution;