export interface StepType {
  step_name: string;
  status: number;
}

export interface MethodsType {
  methods: MethodType[];
  processor: string;
  step_name: string;
}

export interface MethodType {
  METHOD_ID: string;
  METHOD_PARSER_FILTERS: Record<string, any>;
}

export interface WorkflowWithSources {
  name: string;
  status: boolean;
  steps: StepType[];
}

export interface SourcesWithMethods extends StepType {
  minimum_methods: MethodsType;
  optional_methods: MethodsType;
}
