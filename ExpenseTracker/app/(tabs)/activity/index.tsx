import { StyleSheet,ScrollView ,FlatList } from "react-native";
import { Text, View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { Divider, Menu, IconButton } from 'react-native-paper';
import {Fragment, useState} from 'react';
import MultiFAB from "@/components/MultiFAB";

import { format, parseISO ,isToday} from 'date-fns';
import {useGetUnifiedHistoryQuery, useLazyGetUserExpensesQuery, useLazyGetUserPersonalTransactionsQuery, useLazyGetUserSettlementsQuery} from '@/store/userApi';
import TransactionCard from "@/components/readComponents/TransactionCard";
import { globalStyles } from "@/styles/globalStyles";
import { Expense } from "@/store/expenseApi";
import { Settlement } from "@/store/settlementApi";
import { Transaction } from "@/store/personalTransactionApi";
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import { testStyles } from "@/styles/test";
import SearchBar from "@/components/SearchBar";
import { COLORS } from "@/app/utils/constants";


type Filter = "unified" | "split" | "transaction" | "settlement";

export default function ActivityScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<Filter>("unified");
  const [menuVisible, setMenuVisible] = useState(false);


  const {data: dataUnified, isLoading: isLoadingUnified, error: errorUnified} = useGetUnifiedHistoryQuery({});
  const [fetchExpense, {isLoading: isLoadingExpense, error: errorExpense, data: dataExpense}] = useLazyGetUserExpensesQuery();
  const [fetchPersonalTransaction, {isLoading: isLoadingPersonalTransaction, error: errorPersonalTransaction, data: dataPersonalTransaction}] = useLazyGetUserPersonalTransactionsQuery();
  const [fetchSettlement, {isLoading: isLoadingSettlement, error: errorSettlement, data: dataSettlement}] = useLazyGetUserSettlementsQuery();
  
  const Expenses: Expense[] = dataExpense?.data || [];
  const numberOfExpenses: number = Expenses.length;

  const settlements: Settlement[] = dataSettlement?.data || [];
  const numberOfSettlements: number = settlements.length;

  const personalTransactions: Transaction[] = dataPersonalTransaction?.data || [];
  const numberOfPersonalTransactions: number = personalTransactions.length;

  const unifiedHistory = dataUnified?.data || [];
  const numberOfUnified = unifiedHistory.length;

  // grouping Transactions (splits, transactions, settlements) by date and storing in reverse order [if no date is found it categorizes in current date]
  const groupTransactionsByDate = <T extends { created_at_date_time?: Date, createdAt?: Date }>(transactions: T[]) => {
    const grouped: Record<string, T[]> = {};
  
    transactions.forEach((transaction) => {
      const date = transaction?.created_at_date_time?.toString().split('T')[0] || transaction?.createdAt?.toString().split('T')[0] || new Date().toISOString().split('T')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
  
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => new Date(b.created_at_date_time || b.createdAt || new Date).getTime() - new Date(a.created_at_date_time || a.createdAt || new Date).getTime());
    });
    
    return grouped;
  };

  const groupedSettlements: Record<string, Settlement[]> = groupTransactionsByDate(settlements);
  const settlementDates = Object.keys(groupedSettlements).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const groupedPersonalTransactions: Record<string, Transaction[]> = groupTransactionsByDate(personalTransactions);
  const personalTransactionDates = Object.keys(groupedPersonalTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const groupedExpenses: Record<string, Expense[]> = groupTransactionsByDate(Expenses);
  const expenseDates = Object.keys(groupedExpenses).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const groupedUnified: Record<string, Transaction[]> = groupTransactionsByDate(unifiedHistory);
  const unifiedDates = Object.keys(groupedUnified).sort((a, b) => new Date(b).getTime() - new Date(a).getTime()); 

  const FILTER_OPTIONS = [
    { key: 'unified', label: 'Show All' },
    { key: 'split', label: 'Show Splits' },
    { key: 'transaction', label: 'Show Transactions' },
    { key: 'settlement', label: 'Show Settlements' },
  ];

  const fetchDataByKey = async (key: string) => {
    switch (key) {
      case 'split':
        try {
          await fetchExpense();
        } catch (error) {
          console.error(error);
        }
        break;

      case 'transaction':
        try {
          await fetchPersonalTransaction();
        } catch (error) {
          console.error(error);
        }
        break;

      case 'settlement':
        try {
          await fetchSettlement();
        } catch (error) {
          console.error(error);
        }
        break;
    
      default:
        console.log(`No fetch called, key ${key}`);
        break;
    }
  }

  const FilterMenu = () => {
    return (
      <Menu
        visible={menuVisible}
        onDismiss={() => setMenuVisible(false)}
        anchor={
          <IconButton
            icon="filter-variant"
            size={24}
            onPress={() => setMenuVisible(true)}
          />
        }
        anchorPosition="bottom"
        contentStyle={{ backgroundColor: "#fff", paddingVertical: 4 }}
      >
        {FILTER_OPTIONS.map((option, index) => (
          <Fragment key={option.key}>
            <Menu.Item
              onPress={async () => {
                setMenuVisible(false);
                setFilterType(option.key);
                await fetchDataByKey(option.key);
              }}
              titleStyle={{
                color: filterType === option.key ? COLORS.text.bluish : "#000",
                fontWeight: filterType === option.key ? "bold" : "normal",
              }}
              title={option.label}
              style={{
                backgroundColor: filterType === option.key ? "#ebf0f5" : "transparent",
              }}
            />
            {index < FILTER_OPTIONS.length - 1 && <Divider />}
          </Fragment>
        ))}
      </Menu>
    );
  };

  const SearchHeader = () => {
    return (
      <View style={[testStyles.horizontalContainer, test.headContainer]}>
        <View style={{ flex: 1 }}>
          <SearchBar
            placeholder="Search transactions, splits..."
            onSearch={setSearch}
            containerStyle={{height: 40}}
          />
        </View>
        <FilterMenu />
      </View>
    );
  }

  const SplitRow = ({item}: any) => {
    return (
      <TransactionCard 
        pressFunction = {() => router.push({ pathname: "/view/viewExpense", params: { id:item._id} })}
        title={item.description}
        imageType={undefined}
        amount={`₹${item.total_amount}`}
        subtitle={
          item?.created_at_date_time
            ? format(parseISO(item.created_at_date_time.toString()), 'hh:mm a')
            : ''
        }
        transactionType={undefined}
      />
    );
  }

  const TransactionRow = ({item}: any) => {
    return (
      <TransactionCard 
        pressFunction = {() => router.push({ pathname: "/view/viewTransaction", params: { id:item._id} })}
        title={item.description}
        imageType={item.transaction_type}
        amount={`₹${item.amount}`}
        subtitle={format(parseISO(item?.created_at_date_time?.toString()), 'hh:mm a')}
        transactionType={item.transaction_type}
      />
    )
  }

  const SettlementRow = ({item}: any) => {
    return (
      <TransactionCard
        pressFunction={() => router.push({ pathname: "/view/viewSettlement", params: { id:item._id} })}
        title={item.settlement_description}
        imageType={undefined}
        amount={`₹${item.amount}`}
        subtitle={format(parseISO(new Date().toISOString()), 'hh:mm a')}
        transactionType={undefined}
      />
    )
  }

  const selectRowByType = ({type, item}) => {
    switch (type) {
      case "expense":
        return <SplitRow item={item}/>
    
      case "personalTransaction":
        return <TransactionRow item={item}/>
        
      case "settlement":
        return <SettlementRow item={item}/>

      default:
        console.log(`wrong row select by unified`);
        return null;
    }
  }

  const ListFrame = ({listLoader, listLength, listDates, listGrouper, Row}) => {
    return (
      <>
        {listLoader ? (
          <>
            {[...Array(6)].map((_, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                <SkeletonPlaceholder style={{ height: 60, borderRadius: 10 }} />
              </View>
            ))}
          </>
          ) : (
          <>
            { listLength > 0 ? (
              <View style={{paddingBottom: 20}}>
                {listDates.map(date => (
                  <View key={date} style={{backgroundColor:"white"}}>
                    <Text style={styles.sectionTitle}>
                        {isToday(parseISO(date)) ? 'Today' : format(parseISO(date), 'dd MMM')}
                    </Text>

                    <FlatList
                      data={listGrouper[date]}
                      keyExtractor={(item) => item._id}
                      renderItem={({ item }) => (
                        Row ? <Row item={item} /> : selectRowByType({type: item.type, item})
                      )}
                      ItemSeparatorComponent={() => (
                        <View style={{ height: 5 , backgroundColor: 'white' }} />
                      )}
                      contentContainerStyle={{ paddingBottom: 5 }}
                    />
                  </View>
                ))}
              </View> ) : <Text style= {globalStyles.noText}>No splits</Text>
            }
          </>
        )}
      </>
    );
  }

  const UnifiedHistoryList = () => {
      return (
        <ListFrame listLoader={isLoadingUnified} listLength={numberOfUnified} listDates={unifiedDates} listGrouper={groupedUnified} Row={null}/>
      );
  }

  const ExpenseList = () => {
    return (
      <ListFrame listLoader={isLoadingExpense} listLength={numberOfExpenses} listDates={expenseDates} listGrouper={groupedExpenses} Row={SplitRow}/>
    );
  }

  const TransactionList = () => {
    return (
      <ListFrame listLoader={isLoadingPersonalTransaction} listLength={numberOfPersonalTransactions} listDates={personalTransactionDates} listGrouper={groupedPersonalTransactions} Row={TransactionRow}/>
    );
  }

  const SettlementList = () => {
    return (
      <ListFrame listLoader={isLoadingSettlement} listLength={numberOfSettlements} listDates={settlementDates} listGrouper={groupedSettlements} Row={SettlementRow}/>
    );
  }

  const renderList = (filter: Filter) => {
    switch (filter) {
      case "unified":
        return <UnifiedHistoryList/>;
      case "split":
        return <ExpenseList/>;
      case "transaction":
        return <TransactionList/>;
      case "settlement":
        return <SettlementList/>;
      default:
        return <Text style={{ color: 'gray' }}>Oops</Text>;
    }
  }

  return (
    <View style={testStyles.screen}>
      <ScrollView style={testStyles.container}>
        <SearchHeader/>
        {renderList(filterType)}
      </ScrollView>
      <MultiFAB
        actions={[
          {
            icon: 'arrow-collapse',
            label: 'Transaction',
            onPress: () => router.push("/action/create/createExpense"),
          },
          {
            icon: 'call-split',
            label: 'Split Money',
            onPress: () => router.push("/action/create/createTransaction"),
          },
        ]}
      />
    </View>
  )
}

const test = StyleSheet.create({

  headContainer: {
    alignItems: "center",
    marginTop: 30,
    gap: 12,
    marginBottom: 12
  },

})

const styles = StyleSheet.create({
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "bold", 
    marginBottom: 10,
    color: "black"
  },
});