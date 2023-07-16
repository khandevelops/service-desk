import { SPFI } from "@pnp/sp";
import { IRequest } from "../components/IServiceDesk";
import { IItemAddResult } from "@pnp/sp/items";


export const mockTable = (numberOfRequests: number, sp: SPFI, title: string): IRequest[] => {
    const tableData: IRequest[] = []
    while (numberOfRequests > 0) {
        sp.web.lists.getByTitle(title).items.add({
            Category: 'Category' + numberOfRequests,
            SubCategory: 'SubCategory' + numberOfRequests,
            Description: 'Lorem ad laborum nostrud magna. Est elit veniam amet sunt ut quis. Sit id qui consequat laboris nulla officia voluptate commodo ut ut sit. Officia cupidatat occaecat laboris esse eu est do amet laboris.',
            Priority: 'Priority' + numberOfRequests,
            AssignedTo: 'AssignedTo' + numberOfRequests,
            SubmittedBy: 'SubmittedBy' + numberOfRequests,
            CreatedTime: new Date(),
            CompletedBy: 'CompletedBy' + numberOfRequests,
            CompletedTime: new Date(),
            Completed: numberOfRequests % 10 === 0 ? true : false,
            Comment: 'Ea incididunt velit aute fugiat exercitation ullamco excepteur et irure occaecat irure voluptate dolor. Ad anim quis velit nostrud irure adipisicing ipsum. Occaecat Lorem pariatur consequat dolor. Laboris minim commodo proident sint anim proident nulla tempor do. Fugiat reprehenderit nulla velit duis cupidatat aliqua.',

        })
            .then((result: IItemAddResult) => result)
            .catch((error: Error) => console.error(error.message))
        numberOfRequests -= 1;
    }
    return tableData;
}