export class ApiClient {

    async getMaxVoltages(): Promise<string[]> {
        return [
            '8 kV',
            '15 kV',
            '24 kV',
            '36 kV',
        ]
    }

    async getConductorsQuantities(): Promise<string[]> {
        return [
            '1',
            '2',
            '3',
            '4',
        ]
    }

    async getShiledTypes(): Promise<string[]> {
        return [
            'Cinta',
            'Alambre',
        ]
    }

    static instance = new ApiClient();
}

export const apiClient = ApiClient.instance;