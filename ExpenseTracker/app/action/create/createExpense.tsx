import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert, LayoutAnimation, Platform, UIManager } from "react-native";
import { useForm } from "react-hook-form";
import { useLocalSearchParams, useRouter } from "expo-router";

import CustomButton from "@/components/button/CustomButton";
import AmountDescriptionInput from "@/components/inputs/AmountDescriptionInput";
import SplitWithSelector from "@/components/peopleSelectors/SplitWithSelector";
import NotesInput from "@/components/inputs/NotesInput";
import WalletSelector from "@/components/selectors/WalletSelector";
import PhotoSelector from "@/components/selectors/PhotoSelector";
import CustomDateTimePicker from "@/components/selectors/CustomDateTimePicker";
import CategorySelector from "@/components/selectors/CategorySelector";
import { useCreateExpenseMutation } from "@/store/expenseApi";
import Header from "@/components/Header";
import { useToast } from "@/context/ToastContext";
import { testStyles } from "@/styles/test";
import { FONTS } from "@/app/utils/constants";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export type error = {
  message: string;
}

type ChildErrors = {
  amount?: error;
  Description?: error;
}

type LocalParams = {
  group_id?: string;
  group_name?: string;
  detectedId?: string;
  detectedAmount?: string;
  detectedDescription?: string;
  detectedCreated_at_date_time?: string | Date;
  detectedNotes?: string;
}

type Data = {
  date: Date | string;
  time: Date | string;
  splitWith: { user_id: string, amount: number }[];
  paidBy: { user_id: string, name: string, profile_photo?: string };
  photo?: string;
  wallet?: {_id: string} | null;
  amount: number;
  category?: string;
  notes?: string;
  Description: string;
  Title?: string;// these fields are just dummy fields to remove typescript errors
  recurring?: boolean;// these fields are just dummy fields to remove typescript errors
}

export default function AddExpenseScreen() {

  const { showToast } = useToast();
  let { group_id, group_name, detectedId, detectedAmount, detectedDescription, detectedCreated_at_date_time, detectedNotes } = useLocalSearchParams() as LocalParams;
  const [childErrors, setChildErrors] = useState<ChildErrors>({});
  const [validInput, setValidInput] = useState<boolean>(true);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const toggleMoreOptions = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowMoreOptions(prev => !prev);
  };

  const [createExpense, {isLoading:isLoadingExpense}] = useCreateExpenseMutation();

  let detectedAmountNumber = Number(detectedAmount);
  let dateOnly: Date | undefined;
  let timeOnly: Date | undefined;

  if (detectedCreated_at_date_time) {
    const parsedDate = new Date(detectedCreated_at_date_time);
    if (!isNaN(parsedDate.getTime())) {
      dateOnly = new Date(parsedDate.toDateString());
      timeOnly = new Date(1970, 0, 1, parsedDate.getHours(), parsedDate.getMinutes(), parsedDate.getSeconds());
    } else {
      console.warn("Invalid date:", detectedCreated_at_date_time);
    }
  }


  const { control, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: detectedId
      ? {
          amount: detectedAmountNumber,
          Description: detectedDescription,
          splitWith: [],
          paidBy: null,
          notes: detectedNotes,
          wallet: null,
          category: "",
          date:dateOnly || new Date(),
          time:timeOnly || new Date(),
          photo: null,
          Title: "",// these fields are just dummy fields to remove typescript errors
          recurring: false// these fields are just dummy fields to remove typescript errors
        }
      : {
          amount: 0,
          Description: "",
          splitWith: [],
          paidBy: null,
          notes: "",
          wallet: null,
          category: "",
          date: new Date(),
          time: new Date(),
          photo: null,
          Title: "",// these fields are just dummy fields to remove typescript errors
          recurring: false// these fields are just dummy fields to remove typescript errors
        },
  });
  
  
  const router = useRouter();
  const amount = watch("amount");
  const splitWith: { user_id: string, amount: number }[] = watch("splitWith");
  const TOLERANCE = 0.01;
  let invalidSubmit = !splitWith || splitWith.length == 0 || Math.abs(splitWith.reduce((sum, person) => sum + Number(person.amount), 0) - amount) > TOLERANCE || !validInput || splitWith.length === 1;
  

  // useEffect(() => {
  //   if (Object.keys(childErrors).length !== 0) {
  //     console.log("errors",errors)
  //     const messages = [
  //       childErrors.amount?.message,
  //       childErrors.Description?.message
  //     ].filter(Boolean).join("\n");
  
  //     Alert.alert("Invalid data", messages);
  //   }
  // }, [childErrors]);

  useEffect(() => {
    if (Object.keys(childErrors).length !== 0) {
      setValidInput(false);
    } else setValidInput(true);
  }, [childErrors]);


  const onSubmit = async (data: Data) => {
    try {

      //extra checks
      if(splitWith.length === 1) {
        Alert.alert("Invalid data", "Please select people to split with");
        return;
      }

      const totalSplit = splitWith?.reduce((sum, person) => sum + Number(person.amount), 0);
      if (Math.abs(totalSplit - amount) > TOLERANCE) {
        alert("Total split amount must match the entered amount");
        return;
      }


      //date and time merge
      const selectedDate = new Date(data.date);
      const selectedTime = new Date(data.time);

      const created_at_date_time = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes(),
        selectedTime.getSeconds()
      );

  
      //calculating lended amount (total - self)
      let amt = 0;
      data.splitWith.forEach((user) => {
        if (user.user_id === data.paidBy.user_id) amt = user.amount;
      });

      //removing lender from split array
      const filteredSplit = data.splitWith.filter((user) => user.user_id !== data.paidBy.user_id);


      const selectedImage = data?.photo;
  
      //formdata for image passing
      const formData = new FormData();
      formData.append("description", data.Description);
      formData.append("total_amount", String(data.amount));
      formData.append("created_at_date_time", String(created_at_date_time));

      //strigified data to pass in formdata
      formData.append("lenders", JSON.stringify([{ ...data.paidBy, amount: data.amount - amt }]));
      formData.append("borrowers", JSON.stringify(filteredSplit.map((user) => ({ ...user, amount: Number(user.amount) }))));

      //optional details
      if (data?.wallet?._id) {
        formData.append("wallet_id", data.wallet._id);
      }
      if(group_id) {
        formData.append("group_id", group_id);
      }
      if (data?.category) {
        formData.append("expense_category", data.category);
      }
      if (data?.notes) {
        formData.append("notes", data.notes);
      }

      if (selectedImage) {
        const fileExtension = selectedImage.split(".").pop();
        const mimeType = fileExtension === "png" ? "image/png" : "image/jpeg";
  
        formData.append("media", {
          uri: selectedImage,
          type: mimeType,
          name: `split-media.${fileExtension}`,
        } as any);
      }

      const response = await createExpense(formData).unwrap();

      showToast({
        title: `${response.message}`,
        type: "success",
      })

      reset();
      router.back();
    } catch (error) {

      showToast({
        title: `${error.data.message}`,
        type: "error",
      })

    }
  };
  
  
  if(isLoadingExpense) return <View style = {testStyles.centeredPage}><ActivityIndicator color="#000"/></View>;

  return (
    <ScrollView style={testStyles.screen}>
      <View style={[testStyles.container, {gap: 0, marginTop: 10}]}>
        <Header headerText="New Split"/>

        { group_name && (<Text style = {{fontWeight: "500", alignSelf: "center", fontSize: FONTS.medium, marginVertical: 5}}>You're adding this to {group_name}</Text>)}

        {/* if required to propogate error to parent then use like this */}
        {/* <AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors} childErrors = {childErrors}/> */}

        { detectedId ? ( <AmountDescriptionInput control={control} label="Description" isAmountFrozen={true} onErrorsChange={setChildErrors} childErrors = {childErrors}/> ) : ( <AmountDescriptionInput control={control} label="Description" onErrorsChange={setChildErrors} childErrors = {childErrors}/> )}

        <SplitWithSelector control={control} amount={watch("amount")} setValue={setValue} group_id = {group_id} IncludePaidBy/>

        <TouchableOpacity onPress={toggleMoreOptions} style={{ marginVertical: 10, alignSelf: 'center' }}>
          <Text style={{ color: '#000', fontWeight: '500', fontSize: FONTS.medium }}>
            {showMoreOptions ? 'Hide ▲' : 'Add More Details ▼'}
          </Text>
        </TouchableOpacity>

        {showMoreOptions && (
          <>
            <NotesInput control={control} name="notes" />

            <View style={[testStyles.horizontalBoxesContainer]}>
              <WalletSelector control={control} name="wallet" />
              <PhotoSelector control={control} />
            </View>

            <CategorySelector control={control} />

            <View style={[testStyles.horizontalBoxesContainer, { height: 100 }]}>
              <CustomDateTimePicker control={control} name="date" label="Date" heading="Date" disableFutureDates />
              <CustomDateTimePicker control={control} name="time" label="Time" heading="Time" />
            </View>
          </>
        )}

        { splitWith.length < 2 && <View style = {[testStyles.horizontalContainer, {alignSelf: "center", alignItems: "center"}]}><MaterialCommunityIcons name="information-outline" size={20} color="black" /> <Text style = {{fontSize: FONTS.small, marginTop: 7, marginBottom: 5}}> Add at least 2 people</Text></View> }
        <CustomButton onPress={handleSubmit(onSubmit)} style={testStyles.saveButton} disabled = {invalidSubmit}>Save</CustomButton>
      </View>
    </ScrollView>
  );
}