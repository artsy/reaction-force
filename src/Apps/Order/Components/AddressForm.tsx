import { Flex, Join, Sans, Serif, Spacer } from "@artsy/palette"
import Input from "Components/Input"
import { CountrySelect } from "Components/v2"
import React from "react"
import { TwoColumnSplit } from "./TwoColumnLayout"

export interface Address {
  name: string
  country: string
  postalCode: string
  addressLine1: string
  addressLine2: string
  city: string
  region: string
  phoneNumber: string
}

export type AddressErrors = Partial<Address>
export type AddressTouched = Partial<{ [T in keyof Address]: boolean }>
export type AddressChangeHandler = (
  address: Address,
  key: keyof Address
) => void

export const emptyAddress: Address = Object.freeze({
  name: "",
  country: "",
  postalCode: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  region: "",
  phoneNumber: "",
})
export interface AddressFormProps {
  onChange: AddressChangeHandler
  value?: Partial<Address>
  billing?: boolean
  domesticOnly?: boolean
  showPhoneNumberInput?: boolean
  shippingCountry?: string
  phoneNumberOnly?: boolean
  errors: AddressErrors
  touched: AddressTouched
}

interface AddressFormState {
  address: Address
}

export class AddressForm extends React.Component<
  AddressFormProps,
  AddressFormState
> {
  state = {
    address: {
      ...emptyAddress,
      ...this.props.value,
    },
  }

  changeEventHandler = (key: keyof Address) => (
    ev: React.FormEvent<HTMLInputElement>
  ) => {
    this.onChangeValue(key, ev.currentTarget.value)
  }

  changeValueHandler = (key: keyof Address) => (value: string) => {
    this.onChangeValue(key, value)
  }

  onChangeValue = (key: keyof Address, value: string) => {
    this.setState({ address: { ...this.state.address, [key]: value } }, () => {
      this.props.onChange(this.state.address, key)
    })
  }

  getError = (key: keyof Address): string => {
    return (
      (this.props.touched &&
        this.props.touched[key] &&
        this.props.errors &&
        this.props.errors[key]) ||
      ""
    )
  }

  phoneNumberInputDescription = (): string | null => {
    if (this.props.phoneNumberOnly) {
      return "Number to contact for pickup logistics"
    } else if (this.props.billing && this.props.showPhoneNumberInput) {
      return null
    } else {
      return "Required for shipping logistics"
    }
  }

  render() {
    const lockCountryToOrigin = !this.props.billing && this.props.domesticOnly

    const showPhoneNumber =
      this.props.phoneNumberOnly ||
      !this.props.billing ||
      this.props.showPhoneNumberInput

    return (
      <>
        {!this.props.phoneNumberOnly && (
          <Join separator={<Spacer mb={2} />}>
            <Flex flexDirection="column">
              <Input
                id="AddressForm_name"
                placeholder="Add full name"
                title={this.props.billing ? "Name on card" : "Full name"}
                autoCapitalize="words"
                autoCorrect="off"
                value={this.props.value.name}
                onChange={this.changeEventHandler("name")}
                error={this.getError("name")}
                block
              />
            </Flex>

            <TwoColumnSplit>
              <Flex flexDirection="column" pb={1}>
                <Serif mb={1} size="3t" color="black100" lineHeight="1.1em">
                  Country
                </Serif>
                <CountrySelect
                  selected={
                    lockCountryToOrigin
                      ? this.props.shippingCountry
                      : this.state.address.country
                  }
                  onSelect={this.changeValueHandler("country")}
                  disabled={lockCountryToOrigin}
                />
                {lockCountryToOrigin && (
                  <>
                    <Spacer m={0.5} />
                    <Sans size="2" color="black60">
                      Domestic shipping only.
                    </Sans>
                  </>
                )}
              </Flex>

              <Flex flexDirection="column">
                <Input
                  id="AddressForm_postalCode"
                  placeholder="Add postal code"
                  title="Postal code"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  value={this.props.value.postalCode}
                  onChange={this.changeEventHandler("postalCode")}
                  error={this.getError("postalCode")}
                  block
                />
              </Flex>
            </TwoColumnSplit>
            <TwoColumnSplit>
              <Flex flexDirection="column">
                <Input
                  id="AddressForm_addressLine1"
                  placeholder="Add street address"
                  title="Address line 1"
                  autoCapitalize="words"
                  value={this.props.value.addressLine1}
                  onChange={this.changeEventHandler("addressLine1")}
                  error={this.getError("addressLine1")}
                  block
                />
              </Flex>

              <Flex flexDirection="column">
                <Input
                  id="AddressForm_addressLine2"
                  placeholder="Add apt, floor, suite, etc."
                  title="Address line 2 (optional)"
                  autoCapitalize="words"
                  value={this.props.value.addressLine2}
                  onChange={this.changeEventHandler("addressLine2")}
                  error={this.getError("addressLine2")}
                  block
                />
              </Flex>
            </TwoColumnSplit>
            <TwoColumnSplit>
              <Flex flexDirection="column">
                <Input
                  id="AddressForm_city"
                  placeholder="Add city"
                  title="City"
                  autoCapitalize="words"
                  value={this.props.value.city}
                  onChange={this.changeEventHandler("city")}
                  error={this.getError("city")}
                  block
                />
              </Flex>

              <Flex flexDirection="column">
                <Input
                  id="AddressForm_region"
                  placeholder="Add State, province, or region"
                  title="State, province, or region"
                  autoCapitalize="words"
                  autoCorrect="off"
                  value={this.props.value.region}
                  onChange={this.changeEventHandler("region")}
                  error={this.getError("region")}
                  block
                />
              </Flex>
            </TwoColumnSplit>
          </Join>
        )}
        {showPhoneNumber && (
          <>
            <Flex flexDirection="column">
              {!this.props.phoneNumberOnly && <Spacer mb={2} />}
              <Input
                id="AddressForm_phoneNumber"
                title="Phone number"
                type="tel"
                description={this.phoneNumberInputDescription()}
                placeholder="Add phone"
                pattern="[^a-z]+"
                value={this.props.value.phoneNumber}
                onChange={this.changeEventHandler("phoneNumber")}
                error={this.getError("phoneNumber")}
                block
              />
            </Flex>
            <Spacer mb={2} />
          </>
        )}
      </>
    )
  }
}
