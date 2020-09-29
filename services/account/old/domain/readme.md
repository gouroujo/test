#  Domain layer

The Domain layer is the centermost layer in the core. This layer is built out using DDD principles, and nothing in it has any knowledge of anything outside it. For the most part, dependency injection is not used here, though perhaps a rare exception could be made for the event dispatcher implementation.

Domain services and other business logic within the Domain layer don’t even really need to be behind interfaces since that logic is less likely to change over time and there’s less of a need for polymorphism. In areas of the domain where it does make sense to use interfaces, such as using the Strategy pattern to encapsulate different pieces of business logic, go ahead and use them; otherwise, just inject the domain services directly into your classes that need them.