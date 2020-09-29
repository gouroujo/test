export abstract class IFactory<T> {
  public abstract makeSvc(): T
}