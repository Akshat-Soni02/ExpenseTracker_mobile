import { StyleSheet,ScrollView ,FlatList, ActivityIndicator,TouchableOpacity} from "react-native";
import * as React from 'react';
import { FAB ,PaperProvider , Portal,Modal,Surface,IconButton} from 'react-native-paper';
import { useRouter } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { Text, View } from "@/components/Themed";

import TransactionCard from "@/components/readComponents/TransactionCard";
import {useGetUserBudgetsQuery} from '@/store/userApi'; 
import { globalStyles } from "@/styles/globalStyles";
import { Budget ,usePredictBudgetMutation} from "@/store/budgetApi";

export default function BudgetsScreen() {
  const router = useRouter();
  const [visible, setVisible] = React.useState(false);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("General");
  const [predictBudget, {isLoading:isLoadingBudget}] = usePredictBudgetMutation();
  const [predictedBudget, setPredictedBudget] = React.useState<number>(0);
  const [note, setNote] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  const formattedNextMonth = nextMonth.toLocaleDateString('en-US', options);
    
  // const {data: dataBudget, isLoading: isLoadingBudget, error: errorBudget} = useGetUserBudgetsQuery();
  // const [state, setState] = React.useState({ open: false });
  const categories = ["Food", "Transport", "Shopping", "Bills", "Entertainment","General"];
  

  const loadModal = async (category:string) => {
    setSelectedCategory(category);
    setLoading(true);
    setNote(null);
    try{ 
      console.log("Selected Category:", category);
      const response = await predictBudget({ transaction_category: category }).unwrap();
      console.log("Predicted Budget Response:", response);
      setPredictedBudget(response.next_month_budget);
      if (response.note) {
        setNote(response.note);
      }
      showModal();
    }catch (error) {
      console.error("Error predicting budget:", error);
    } finally {
      setLoading(false);
      showModal();
    }
  };
  const showModal = () => {
      setVisible(true);
  };
  const hideModal = () => setVisible(false);
  // if (isLoadingBudget) return <View style = {{width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "white"}}><ActivityIndicator color="#000"/></View>;

  // if (errorBudget) {
  //   let errorMessage = "An unknown error occurred";
  
  //   if ("status" in errorBudget) {
  //     errorMessage = `Server Error: ${JSON.stringify(errorBudget.data)}`;
  //   } else if ("message" in errorBudget) {
  //     errorMessage = `Client Error: ${errorBudget.message}`;
  //   }
  //   return <Text style={globalStyles.pageMidError}>{errorMessage}</Text>;
  // }


  // const { open } : { open : boolean} = state;
  // const onStateChange = ({ open } : { open : boolean}) => setState({ open });

  // const budgets: Budget[] = dataBudget?.data || [];
  // const numberOfBudgets: number = budgets.length;

  return (
    <PaperProvider>
    <View style={globalStyles.screen}>

        <ScrollView style={globalStyles.viewContainer}>
          
          <View style = {globalStyles.viewHeader}>
            <FontAwesome name="arrow-left" size={20} color="black" onPress={() => router.replace("/(tabs)")} style = {globalStyles.backButton}/>     
            <Text style={globalStyles.headerText}>Predict Budgets</Text>
          </View>
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={()=>loadModal(item)}>
              <View style={styles.card}>
                <Text style={styles.itemText}>{item}</Text>
              </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{  height: 20, backgroundColor: 'white'}} />}
            contentContainerStyle={{ paddingBottom: 5 }}
            nestedScrollEnabled={true}
          />         
        </ScrollView>
    </View>
    
    <Portal>
        <Modal visible={visible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
        <Surface style={styles.surface} elevation={4}>
          <Text style={styles.title}>{selectedCategory}</Text>
          <Text style={styles.amount}>
            <Text style={styles.currency}>₹</Text>
            <Text style={styles.amountValue}> {predictedBudget}</Text>
          </Text>
          {note && <Text style={styles.note}>{note}</Text>}
          <View style={styles.monthContainer}>
            <IconButton icon="calendar-month" size={20} style={styles.icon} />
            <Text style={styles.monthText}>{formattedNextMonth}</Text>
          </View>
        </Surface>
        </Modal>
        {loading && (
          <Modal visible={loading} dismissable={false} contentContainerStyle={{ backgroundColor: 'white', padding: 20, margin: 20 }}>
          <View style={{ alignItems: 'center' }}>
            <ActivityIndicator size="large" />
            <Text style={{ marginTop: 10 }}>Predicting budget...</Text>
          </View>
        </Modal>
        )}
      </Portal>
    </PaperProvider>
    );
}



const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemText: {
    fontSize: 20,
    color: '#333',
    fontWeight: '500',
  },
  surface: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  amount: {
    fontSize: 32,
    marginBottom: 8,
    flexDirection: 'row',
  },
  
  currency: {
    fontWeight: 'normal',
    fontSize: 32,
    color: '#555',
  },
  
  amountValue: {
    fontWeight: 'bold',
    fontSize: 32,
    color: '#000', 
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginBottom: 24,
  },
  
  icon: {
    margin: 0,
    marginRight: 4,
  },
  
  monthText: {
    fontSize: 16,
    color: '#666',
  },
  modalContainer: {
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: {
    fontSize: 14,
    color: 'red',
    fontStyle: 'italic',
  },
});
