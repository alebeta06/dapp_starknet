use starknet::ContractAddress;
use snforge_std::DeclareResultTrait;
use snforge_std::{declare, ContractClassTrait};
use contracts::counter::ICounterDispatcherTrait;
use contracts::counter::ICounterDispatcher;

#[test]
fn test_countrac_initialization() {
    let contract = declare("CounterContract").unwrap().contract_class();

    let init_counter: u32 = 5;
    let owner_address: ContractAddress = 'owner'.try_into().unwrap();

    let mut constructor_arg = array![];
    init_counter.serialize(ref constructor_arg);
    owner_address.serialize(ref constructor_arg);

    let (contract_address, _) = contract.deploy(@constructor_arg).unwrap();
    let dispatcher = ICounterDispatcher { contract_address };

    let current_counter = dispatcher.get_counter();
    let expected_counter: u32 = 5;
    assert!(current_counter == expected_counter, "initialization of counter failed");
}