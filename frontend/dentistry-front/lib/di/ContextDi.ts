import { IContexContainer } from "./IContextContainer"

class ClientContextDI
{
    protected di :IContexContainer
    constructor(ctx:IContexContainer)
    {
        this.di=ctx;
    }
}

export default ClientContextDI