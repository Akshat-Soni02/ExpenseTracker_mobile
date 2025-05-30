export const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);


export const formatCurrency = (amount: number | undefined) => {
    return amount ? `${amount.toFixed(2)}` : 0;
}
    
  