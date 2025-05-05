import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Dimensions} from "react-native";
import { LineChart,PieChart } from 'react-native-chart-kit';
import { FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { globalStyles } from "@/styles/globalStyles";
import { useGetMonthlySpendQuery,useGetCategoricalSpendQuery } from '@/store/analyticsApi';
const { width } = Dimensions.get('window');


export default function ViewBudgetScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data, isLoading, error, refetch } = useGetMonthlySpendQuery();
  const {data:categoricalData, isLoading:loadingCategoricalData, error:errorCategoricalData} = useGetCategoricalSpendQuery();

  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: { data: number[] }[];
  }>({
    labels: [],
    datasets: [
      {
        data: []
      }
    ]
  });

  const [pieChartData, setPieChartData] = useState<
  {
    name: string;
    population: number;
    color: string;
    legendFontColor: string;
    legendFontSize: number;
  }[]
>([]);

  useEffect(() => {
    if (data?.data) {
      setLoading(true);
      const getMonthName = (monthString: string) => {
        const [year, month] = monthString.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1); 
        return date.toLocaleString('default', { month: 'long' });
      };
      data?.data?.sort((a, b) => a.month.localeCompare(b.month));
      const firstMonth = new Date(data?.data[0].month);
      const lastMonth = new Date(data?.data[data?.data.length - 1].month);
      
      const allMonths = [];
      let currentMonth = new Date(firstMonth);

      while (currentMonth <= lastMonth) {
        const monthString = currentMonth.toISOString().slice(0, 7); 
        allMonths.push(monthString);
        currentMonth.setMonth(currentMonth.getMonth() + 1);
      }

      const completeMonthlyData = allMonths.map(month => {
        const existingData = data?.data.find(item => item.month === month);
        return existingData ? existingData : { month, amount: 0 };
      });
      const chartData = {
        labels: completeMonthlyData.map(item => getMonthName(item.month)),
        datasets: [{
          data: completeMonthlyData.map(item => item.amount),
        }],
      };
      setChartData(chartData);
      console.log("ChartData",chartData.labels.length);

      setLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (categoricalData?.data) {
      setLoading(true);
      console.log("data?.data",categoricalData?.data);
      const pieChartData = Object.entries(categoricalData?.data)
        .filter(([_, value]) => typeof value === 'number' && value > 0) 
        .map(([key, value], index) => ({
          name: key,
          population: Number(value),
          color: ['#2ECC71', '#3498DB', '#F39C12', '#E74C3C', '#9B59B6', '#1ABC9C'][index % 6],
          legendFontColor: '#7F7F7F',
          legendFontSize: 14,
      }));
      setPieChartData(pieChartData);
      setLoading(false);
    }
  }, [categoricalData]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // if (error || errorCategoricalData) {
  //   let errorMessage = "An unknown error occurred";
  
  //   if ("status" in error || "status" in errorCategoricalData) {
  //     errorMessage = `Server Error: ${JSON.stringify(error.data)}`;
  //   } else if ("message" in errorBudget) {
  //     errorMessage = `Client Error: ${errorBudget.message}`;
  //   }
  //   return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  // }

  return (
    <ScrollView style={globalStyles.viewContainer}>

      <View>
          <View style = {globalStyles.viewHeader}>
              <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style={globalStyles.backButton}/>
              <Text style={globalStyles.headerText}>Analytics</Text>
          </View>
        {!loading && chartData.labels.length>0 &&(
          <View style={{ marginVertical: 16, paddingLeft:5,alignItems: "center"}}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#333'}}>
              Spending Trend
            </Text>
            <LineChart
            data={chartData}
            width={width - 25}
            height={250}
            yAxisLabel="₹"
            fromZero
            withInnerLines={false}
            withOuterLines={true}
            yLabelsOffset={15}
            xLabelsOffset={-5}
            segments={5}
            chartConfig={{
            backgroundColor: '#f8f9fa',
            backgroundGradientFrom: '#e0f7fa',
            backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: (opacity = 1) => `#512DA8`, 
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 12,

              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#2196F3',
                fill: '#ffffff'
              },
              propsForBackgroundLines: {
                  strokeDasharray: '', 
                  stroke: '#000'
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 5,
            }}
            verticalLabelRotation={0}
            horizontalLabelRotation={0}
            withVerticalLabels={true}
            withHorizontalLabels={true}
          />
        </View>
        )}

        {!loading && pieChartData.length>0 && (
          <View style={{ marginVertical: 16, paddingLeft: 5,alignItems: "center"}}>
            <Text style={{ fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#333' }}>
              Category-wise Expense Breakdown
            </Text>
            <PieChart
            data={pieChartData}
            width={width-25}
            height={250}
            chartConfig={{
              backgroundColor: '#f8f9fa',
              backgroundGradientFrom: '#e0f7fa',
              backgroundGradientTo: '#ffffff',
              color: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`, // darker text
              labelColor: (opacity = 1) => `rgba(66, 66, 66, ${opacity})`, // label text
              
            }}
            accessor={'population'}
            backgroundColor={'#e0f7fa'}
            paddingLeft={'15'}
            hasLegend={true}
            avoidFalseZero={true}
            style={{
              marginVertical: 8,
              borderRadius: 12,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 4,
              },
              shadowOpacity: 0.2,
              shadowRadius: 6,
              elevation: 5,
            }}
            
          />
         </View> 
        )}
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  
  menuButton: {
    padding: 10,
  },
  
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  amountContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
  },
  section: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    fontSize: 18,
    color: "#555",
    marginTop: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
  },
  errorMessage: {
    textAlign: "center",
    color: "red",
    marginTop: 20,
  },
});