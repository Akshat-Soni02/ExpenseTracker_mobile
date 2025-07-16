import { StyleSheet, ScrollView, FlatList, Alert } from "react-native";
import { View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { useGetUserCategoriesQuery, Category, useCreateCategoryMutation, useUpdateCategoryMutation, useDeleteCategoryMutation } from "@/store/categoryApi";
import SkeletonPlaceholder from "@/components/skeleton/SkeletonPlaceholder";
import Header from "@/components/Header";
import { testStyles } from "@/styles/test";
import ErrorState from "@/components/ErrorState";
import EmptyState from "@/components/EmptyState";
import AppFAB from "@/components/AppFAB";
import TransactionCard from "@/components/readComponents/TransactionCard";
import { formatCurrency } from "../utils/helpers"; // optional if needed for future
import { globalStyles } from "@/styles/globalStyles";
import CategoryModal from "../action/create/categoryModal";
import { useState } from "react";
import CategoryActionSheet from "@/components/CategoryActionSheet";

export default function CategoryScreen() {
  const router = useRouter();

  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [actionSheetVisible, setActionSheetVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [createCategory, {isLoading: loadingCreateCateg}] = useCreateCategoryMutation();
  const [updateCategory, {isLoading: loadingUpdateCateg}] = useUpdateCategoryMutation();
  const [deleteCategory, {isLoading: laodingDeleteCateg}] = useDeleteCategoryMutation();

  const handleCategoryPress = (category: Category) => {
    setSelectedCategory(category);
    setActionSheetVisible(true);
  };
  
  const handleEdit = () => {
    if (!selectedCategory) return;
    setEditingCategory(selectedCategory);
    setModalVisible(true);
    setActionSheetVisible(false);
  };
  
  const handleDelete = async () => {
    if (!selectedCategory) return;
    await deleteCategory(selectedCategory._id);
    setActionSheetVisible(false);
  };
  
  
  const handleSubmitCategory = (name: string) => {
    if (editingCategory) {
      updateCategory({id: editingCategory._id, body: { name }});
      console.log("Update:", editingCategory._id, name);
    } else {
      createCategory({ name });
      console.log("Create:", name);
    }
    setModalVisible(false);
  };

  const {
    data: dataCategory,
    isLoading: isLoadingCategory,
    error: errorCategory,
    isError: hasErrorCategory,
  } = useGetUserCategoriesQuery();

  const errors = [errorCategory].filter(Boolean);
  const hasErrors = errors.length > 0;

  const handleRetry = () => {
    if (hasErrorCategory) console.log("retry triggered");
  };

  const categories: Category[] = dataCategory?.data || [];
  const numberOfCategories = categories.length;
  
  const handleCreatePress = () => {
    setEditingCategory(null);
    setModalVisible(true);
  };

  return (
    <View style={testStyles.screen}>
      <ScrollView style={testStyles.container}>
        <Header headerText="Categories" />

        {isLoadingCategory ? (
          <>
            {[...Array(6)].map((_, index) => (
              <View key={index} style={{ marginBottom: 20 }}>
                <SkeletonPlaceholder style={{ height: 60, borderRadius: 10 }} />
              </View>
            ))}
          </>
        ) : (
          <>
            {numberOfCategories > 0 ? (
              <FlatList
                data={categories}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <TransactionCard
                    pressFunction={() => item.user_id !== null && handleCategoryPress(item)}
                    title={item.name}
                    imageType={undefined}
                    amount={undefined}
                    transactionType={undefined}
                  />
                )}
                ItemSeparatorComponent={() => (
                  <View style={{ height: 5, backgroundColor: "white" }} />
                )}
                contentContainerStyle={{ paddingBottom: 5 }}
              />
            ) : (
              <EmptyState
                title="No Categories"
                subtitle="Use categories to group expenses, set budgets, and track spending habits."
                iconName="alpha-c-box-outline"
              />
            )}
          </>
        )}
      </ScrollView>

        <CategoryModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onSubmit={handleSubmitCategory}
            defaultName={editingCategory?.name}
        />

        <CategoryActionSheet
            visible={actionSheetVisible}
            onClose={() => setActionSheetVisible(false)}
            onEdit={handleEdit}
            onDelete={handleDelete}
            categoryName={selectedCategory?.name || "Category"}
        />

      <AppFAB
        icon="plus"
        onPress={handleCreatePress}
      />
    </View>
  );
}
