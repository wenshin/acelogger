interface Bundle {
  execute(rt: Runtime): void;
}

class WidgetBundle implements Bundle {
  execute(rt: WebWorkerRuntime): void {}
}

interface WidgetBundle extends Bundle {}

interface BundleManager {
  downloadBundleById(id: string): string;
  parseBundle(path: string): Bundle;
}

interface WidgetBundleManager {
  downloadBundleById(id: string): string;
  parseBundle(path: string): Bundle;
}

interface TwoThreadRuntime {
  run(bundle: Bundle): void;
  setBuildInAPI(api: BuiltInAPI): void;
}

class WebWorkerRuntime implements TwoThreadRuntime {
  run(bundle: Bundle): void {}
  setBuildInAPI(api: BuiltInAPI): void {}
}

class WebviewV8Runtime implements TwoThreadRuntime {
  run(bundle: Bundle): void {}
  setBuildInAPI(api: BuiltInAPI): void {}
}

interface BuiltInAPI {
  login(): Promise<any>;
  logout(): Promise<any>;
  getLocation(): Promise<any>;
  getGallary(): Promise<any>;
}

interface AppletEngine {
  runRuntime(rt: Runtime): void;
}

interface WidgetEngine extends AppletEngine {
  bundleManager: WidgetBundl eManager
}



enum BridgeCode {
  SUCC = 0,
  // 系统平台错误
  SYS_NOT_SUPPORT = 1,
  SYS_FS_READ_FORBIDDEN = 100,
  SYS_FS_WRITE_FORBIDDEN = 101,
  SYS_FS_NOT_FOUND = 102,

  // 宿主平台错误
  HOST_NOT_SUPPORT = 100000,
  HOST_EXECUTE_FAIL = 100001,
  HOST_SEQUENCE_FAIL = 100002,
  HOST_USRE_FORBIDDEN = 100100,

  // 开发者错误
  DEV_INVALID_PARAMS = 200000,
  DEV_SDK_UPGRADE_NEEDED = 200001,
  DEV_SDK_VERSION_INVALID = 200002,

  // 用户异常
  USER_INVALID_PARAMS = 300000,
  USRE_UNAUTHORIZED = 300100,
  USRE_FORBIDDEN = 300101,
  USRE_REJECTED = 300102,
}
interface BridgeIncomming {
  code: BridgeCode
  message: string
  data: any
}

interface Bridge {
  invoke(method: string, params?: any): Promise<any>
  on(name: string, handler: (res: BridgeIncomming) => void): void
  emit(name: string, ...args:any[]): void
}


let a = 1;

let b: A = {

}

let a = foo()
  | (arg1, arg2, err) {
    return '123', err
  }
  | (arg1, err) {
    return '123', err
  }

// all is public
interface IA {
  public new();
  public method(a: string);
}


class A1 implements IA {
  new() {

  }

  constructor() {
    a = 1
    b = 2
  }
}

interface AInterface<T: interface> {
  a: T
  b: String
  c()
}

methods and interface
mixin AMinxin {

}

class A {

  extends C/mixin {
    self/super
  }

  impl interface {

  }

  impl AInterface {

  }
}

class AB {
  extends A {

  }

  extends B {

  }

  extends AMinxin {

  }

  impl AInterface {

  }

}
