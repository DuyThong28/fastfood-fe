import { api } from "@/lib/api-client";
import { Address, ResAddress } from "@/types/address";
import { trimObjectAttributes } from "@/utils/format";

class AddressService {
    async createAddress(data: Address) {
        const trimmedData = trimObjectAttributes(data);
        return api.post('address/create', trimmedData)
    }

    async getAllAddressByUser(): Promise<{ data: { data: ResAddress[] } }> {
        return api.get('address/get-all-by-user');
    }

    async deleteAddressById(id: string) {
        return api.delete(`address/delete/${id}`);
    }

    async updateAddressById(data: Address) {
        const trimmedData = trimObjectAttributes(data);
        return api.post(`address/update/${trimmedData.id}`, { address: trimmedData.address, phoneNumber: trimmedData.phoneNumber, fullName: trimmedData.fullName })
    }
}

export default new AddressService();