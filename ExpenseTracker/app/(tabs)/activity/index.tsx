import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  View,
  SectionList,
  Text,
} from "react-native";
import { useRouter } from "expo-router";
import { Divider, Menu, IconButton } from "react-native-paper";
import { format, parseISO, isToday } from "date-fns";

import MultiFAB from "@/components/MultiFAB";
import SearchBar from "@/components/SearchBar";
import TransactionCard from "@/components/readComponents/TransactionCard";
import EmptyState from "@/components/EmptyState";

import {
  useGetUnifiedHistoryQuery,
  useLazyGetUserExpensesQuery,
  useLazyGetUserPersonalTransactionsQuery,
  useLazyGetUserSettlementsQuery,
} from "@/store/userApi";

import { COLORS } from "@/app/utils/constants";
import { testStyles } from "@/styles/test";
import { formatTime } from "@/app/utils/dateUtils";
import { formatCurrency } from "@/app/utils/helpers";
import ErrorState from "@/components/ErrorState";

type Filter = "unified" | "split" | "transaction" | "settlement";

export default function ActivityScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<Filter>("unified");
  const [menuVisible, setMenuVisible] = useState(false);

  // Fetch queries
  const { data: dataUnified, isLoading: loadingUnified, error: errorUnified, isError: hasErrorUnified } = useGetUnifiedHistoryQuery({});
  const [fetchExpense, { data: dataExpense, isLoading: loadingExpense, error: errorExpense, isError: hasErrorExpense}] = useLazyGetUserExpensesQuery();
  const [fetchPersonalTransaction, { data: dataPersonalTransaction, isLoading: loadingPersonal, error: errorPersonal, isError: hasErrorPersonal }] = useLazyGetUserPersonalTransactionsQuery();
  const [fetchSettlement, { data: dataSettlement, isLoading: loadingSettlement, error: errorSettlemenet, isError: hasErrorSettlement }] = useLazyGetUserSettlementsQuery();

  const errors = [errorUnified, errorExpense, errorPersonal, errorSettlemenet].filter(Boolean);
  const hasErrors = errors.length > 0;

  const handleRetry = () => {
    if (hasErrorUnified) console.log("retry triggered");
    if (hasErrorExpense) console.log("retry triggered");
    if (hasErrorPersonal) console.log("retry triggered");
    if (hasErrorSettlement) console.log("retry triggered");
  };

  // Extract arrays from data
  const unifiedHistory = dataUnified?.data || [];
  const expenses = dataExpense?.data || [];
  const personalTransactions = dataPersonalTransaction?.data || [];
  const settlements = dataSettlement?.data || [];

  // Fetch data on filter change (except 'unified')
  useEffect(() => {
    if (filterType === "split") fetchExpense();
    else if (filterType === "transaction") fetchPersonalTransaction();
    else if (filterType === "settlement") fetchSettlement();
  }, [filterType]);

  // Grouping helper - groups by date string and sorts each group descending by time
  const groupTransactionsByDate = <T extends { created_at_date_time?: string; createdAt?: string }>(transactions: T[]) => {
    const grouped: Record<string, T[]> = {};

    transactions.forEach((transaction) => {
      const dateStr =
        transaction?.created_at_date_time?.split("T")[0] ||
        transaction?.createdAt?.split("T")[0] ||
        new Date().toISOString().split("T")[0];

      if (!grouped[dateStr]) grouped[dateStr] = [];
      grouped[dateStr].push(transaction);
    });

    Object.keys(grouped).forEach((date) => {
      grouped[date].sort(
        (a, b) =>
          new Date(b.created_at_date_time || b.createdAt || 0).getTime() -
          new Date(a.created_at_date_time || a.createdAt || 0).getTime()
      );
    });

    // Convert to SectionList format [{title: date, data: [...]}, ...]
    const sections = Object.keys(grouped)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map((date) => ({ title: date, data: grouped[date] }));

    return sections;
  };

  // Pick current data list based on filterType
  const currentList = useMemo(() => {
    switch (filterType) {
      case "split":
        return expenses;
      case "transaction":
        return personalTransactions;
      case "settlement":
        return settlements;
      case "unified":
      default:
        return unifiedHistory;
    }
  }, [filterType, expenses, personalTransactions, settlements, unifiedHistory]);

  // Filter list by search query
  const filteredList = useMemo(() => {
    if (!search.trim()) return currentList;

    const searchLower = search.toLowerCase();

    return currentList.filter((item: any) => {
      if (filterType === "settlement") {
        return item.settlement_description?.toLowerCase().includes(searchLower);
      }
      return item.description?.toLowerCase().includes(searchLower);
    });
  }, [search, currentList, filterType]);

  // Group filtered list by date for SectionList
  const sections = useMemo(() => groupTransactionsByDate(filteredList), [filteredList]);

  // Row components - memoized for performance
  const SplitRow = React.memo(({ item }: { item: any }) => (
    <TransactionCard
      pressFunction={() => router.push({ pathname: "/view/viewExpense", params: { id: item._id } })}
      title={item.description}
      subtitle={`Paid by ${item.giver}`}
      imageType={undefined}
      optionText={formatTime(item.created_at_date_time)}
      amount={`₹${formatCurrency(item.total_amount)}`}
      transactionType={undefined}
    />
  ));

  const TransactionRow = React.memo(({ item }: { item: any }) => (
    <TransactionCard
      pressFunction={() => router.push({ pathname: "/view/viewTransaction", params: { id: item._id } })}
      title={item.description}
      imageType={item.transaction_type}
      amount={`₹${item.amount}`}
      subtitle={format(parseISO(item.created_at_date_time || item.createdAt), "hh:mm a")}
      transactionType={item.transaction_type}
    />
  ));

  const SettlementRow = React.memo(({ item }: { item: any }) => (
    <TransactionCard
      pressFunction={() => router.push({ pathname: "/view/viewSettlement", params: { id: item._id } })}
      title={item.settlement_description}
      subtitle={`${item.payer_name} paid ${item.receiver_name}`}
      imageType={undefined}
      amount={`₹${formatCurrency(item.amount)}`}
      optionText={formatTime(item.createdAt || new Date())}
      transactionType={undefined}
    />
  ));

  // Decide which row component to render based on filterType
  const renderItem = ({ item }: { item: any }) => {
    switch (filterType) {
      case "split":
        return <SplitRow item={item} />;
      case "transaction":
        return <TransactionRow item={item} />;
      case "settlement":
        return <SettlementRow item={item} />;
      case "unified":
      default:
        // For unified, differentiate by type property if exists (you can adjust as needed)
        if (item.type === "expense") return <SplitRow item={item} />;
        if (item.type === "personalTransaction") return <TransactionRow item={item} />;
        if (item.type === "settlement") return <SettlementRow item={item} />;
        return null;
    }
  };

  // Header with search and filter menu
  const FilterMenu = () => (
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
      {[
        { key: "unified", label: "Show All" },
        { key: "split", label: "Show Splits" },
        { key: "transaction", label: "Show Transactions" },
        { key: "settlement", label: "Show Settlements" },
      ].map((option, i, arr) => (
        <React.Fragment key={option.key}>
          <Menu.Item
            onPress={() => {
              setMenuVisible(false);
              setFilterType(option.key as Filter);
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
          {i < arr.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Menu>
  );

  const SearchHeader = () => (
    <View style={[testStyles.horizontalContainer, styles.headContainer]}>
      <View style={{ flex: 1 }}>
      <SearchBar
        placeholder="Search transactions, splits..."
        onSearch={setSearch}
        value={search}
        containerStyle={{ height: 40 }}
      />
      </View>
      <FilterMenu />
    </View>
  );

  if (hasErrors) {
    return <ErrorState errors={errors} onRetry={handleRetry} />;
  }


  return (
    <View style={testStyles.screen}>
      <SearchHeader />

      {loadingUnified || loadingExpense || loadingPersonal || loadingSettlement ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      ) : sections.length === 0 ? (
          <EmptyState
            title="No history"
            subtitle="You can see all your activity here."
            iconName="history"
          />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionTitle}>
              {isToday(parseISO(title)) ? "Today" : format(parseISO(title), "dd MMM")}
            </Text>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 5, backgroundColor: "white" }} />}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 10 }}
          showsVerticalScrollIndicator={false}
          />
          )}
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
          );
        }


        const styles = StyleSheet.create({
          headContainer: {
            alignItems: "center",
            marginTop: 30,
            gap: 12,
            marginBottom: 12,
            paddingHorizontal: 10
          },
          sectionTitle: {
            fontWeight: "bold",
            fontSize: 18,
            paddingVertical: 10,
            paddingHorizontal: 5,
            // backgroundColor: COLORS.bg.greyLight,
            color: COLORS.text.bluish,
          },
          });

