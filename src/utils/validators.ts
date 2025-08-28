

export function validateRequiredFields(data: any[]): string[] {
    const missingFields: string[] = [];

    for (const eachkey in data) {
        if (!data[eachkey]) {
            missingFields.push(eachkey);
        }
    }

  return missingFields;
}

