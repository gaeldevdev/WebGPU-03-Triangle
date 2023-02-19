export class GPU {
    private status: boolean;
  
    private readonly STATUS_OK: string = 'Great, your current browser supports WebGPU!';
    private readonly STATUS_KO: string = 'Your current browser does not support WebGPU!';

    public constructor() {
      this.status = Reflect.get(navigator, 'gpu') != null
    }

    public getStatus(): boolean {
      return this.status;
    }

    public getNavigatorGPU(){
        return Reflect.get(navigator, 'gpu')
    }

    public getStatusMessage(){
        if (this.status){
            return this.STATUS_OK;
        } else {
            return this.STATUS_KO;
        }
    }

    private async requestAdapter(): Promise<GPUAdapter | null>{
        if (!this.status) return null;
        return this.getNavigatorGPU().requestAdapter() as unknown as GPUAdapter
    }

    public async requestDevice(){
        if (!this.status) return null;
        const adapter = await this.requestAdapter() as GPUAdapter;
        return adapter?.requestDevice() as unknown as GPUDevice;
    }
  }