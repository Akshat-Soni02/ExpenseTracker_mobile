export const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);


export const formatCurrency = (amount: number | undefined) => {
    return amount ? `${amount.toFixed(2)}` : 0;
}


export const getErrorMessage = (error: unknown): string => {
    if (!error) return '';

    if (typeof error === 'object' && error && 'status' in error && 'data' in error) {
        const err = error as { status: number; data: any };
        if (typeof err.data === 'string') return err.data;
        if (err.data?.message) return err.data.message;
        return JSON.stringify(err.data);
    }

    if (error instanceof Error) return error.message;

    return JSON.stringify(error);
};
  
    
  