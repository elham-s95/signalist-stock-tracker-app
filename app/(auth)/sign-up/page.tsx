'use client';

import { SubmitHandler, useForm } from 'react-hook-form';
import InputField from '@/components/forms/InputField';
import SelectField from '@/components/forms/SelectField';
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from '@/lib/constants';
import { CountrySelectField } from '@/components/forms/CountrySelectField';
import FooterLink from '@/components/forms/FooterLink';

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      country: 'US',
      investmentGoals: 'Medium',
      preferredIndustry: 'Technology',
    },
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<SignUpFormData> = async (
    data: SignUpFormData,
  ) => {
    try {
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1 className="form-title">Sign Up & Personalize</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/*name field*/}
        <InputField
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          register={register}
          error={errors.fullName}
          validation={{ required: 'Full name is required', minLength: 2 }}
        />
        {/*email field*/}
        <InputField
          name="email"
          label="Email"
          placeholder="test@email.com"
          register={register}
          error={errors.email}
          validation={{
            required: 'Email is required',
            pattern: /^\w+@\w+\.\w+$/,
            message: 'Email address is required',
          }}
        />
        {/*password field*/}
        <InputField
          name="password"
          label="Password"
          placeholder="Enter a strong password"
          register={register}
          type="password"
          error={errors.password}
          validation={{
            required: 'Password is required',
            minLength: 8,
          }}
        />

        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />

        {/*Investment Goals*/}
        <SelectField
          name="investmentsGoals"
          label="Investment Goals"
          placeholder="Select your investment goal"
          options={INVESTMENT_GOALS}
          control={control}
          error={errors.investmentGoals}
          required
        />

        {/*Risk Tolerance*/}
        <SelectField
          name="riskTolerance"
          label="Risk Tolerance"
          placeholder="Select your risk level"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          error={errors.riskTolerance}
          required
        />

        {/*Preferred Industry*/}
        <SelectField
          name="preferredIndustry"
          label="Preferred Industry"
          placeholder="Select your preferred Industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          error={errors.preferredIndustry}
          required
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting
            ? 'Creating Account'
            : 'Start Your Investigating Journey'}
        </button>

        <FooterLink
          text="Already have an account"
          linkText="Sign in"
          href="/sign-in"
        />
      </form>
    </>
  );
};
export default SignUp;
