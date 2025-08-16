import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { AddSolutionCodeRequest, AddTestCaseRequest, BulkUploadTestCasesRequest, CreateProblemRequest, RemoveSolutionCodeRequest, RemoveTestCaseRequest, UpdateProblemRequest, UpdateSolutionCodeRequest } from "@/types/problem-api-types/payload/admin";
import type { ListProblemParams } from "@/types/problem-api-types/payload/public";
import type { AdminProblemDetailsResponse } from "@/types/problem-api-types/responses/admin";
import type { ListProblemResponse } from "@/types/problem-api-types/responses/public";

const preUrl = `admin/problems`

const adminProblemApiSlice = apiSlice.injectEndpoints({
    endpoints : (builder) => ({

        adminListProblem : builder.query<ApiSuccess<ListProblemResponse>,ListProblemParams>({
            query : (params) => ({
                url : `${preUrl}/`,
                method : 'GET',
                params
            }),
            providesTags : ['admin']
        }),
        adminGetProblemDetails : builder.query<ApiSuccess<AdminProblemDetailsResponse>,string>({
            query : (problemId) => ({
                url : `${preUrl}/${problemId}`,
                method : 'GET',
            }),
            providesTags : ['admin']
        }),
        adminCreateProblem : builder.mutation<ApiSuccess<CreateProblemRequest>,string>({
            query : (problemDetails) => ({
                url : `${preUrl}/create`,
                method : 'POST',
                body : problemDetails
            }),
            invalidatesTags : ['admin']
        }),
        adminUpdateProblemDetails : builder.mutation<ApiSuccess<null>,UpdateProblemRequest>({
            query : ({problemId, updatedData}) => ({
                url : `${preUrl}/${problemId}/update`,
                method : 'PATCH',
                body : updatedData
            }),
            invalidatesTags : ['admin']
        }),
        adminAddTestCase : builder.mutation<ApiSuccess<null>,AddTestCaseRequest>({
            query : ({problemId, testCaseData}) => ({
                url : `${preUrl}/${problemId}/add`,
                method : 'POST',
                body : testCaseData
            }),
            invalidatesTags : ['admin']
        }),
        adminBulkUploadTestCase : builder.mutation<ApiSuccess<null>,BulkUploadTestCasesRequest>({
            query : ({problemId, testcaseData}) => ({
                url : `${preUrl}/${problemId}/testCases/bulkUpload`,
                method : 'POST',
                body : testcaseData
            }),
            invalidatesTags : ['admin']
        }),
        adminRemoveTestCase : builder.mutation<ApiSuccess<null>,RemoveTestCaseRequest>({
            query : ({problemId, testCaseId}) => ({
                url : `${preUrl}/${problemId}/testCases/${testCaseId}/remove`,
                method : 'DELETE'
            }),
            invalidatesTags : ['admin']
        }),
        adminAddSolutionCode : builder.mutation<ApiSuccess<null>,AddSolutionCodeRequest>({
            query : ({problemId, solutionCode}) => ({
                url : `${preUrl}/${problemId}/solutionCodes/add`,
                method : 'POST',
                body : solutionCode
            }),
            invalidatesTags : ['admin']
        }),
        adminUpdateSolutionCode : builder.mutation<ApiSuccess<null>,UpdateSolutionCodeRequest>({
            query : ({problemId, solutionCodeId, updatedData}) => ({
                url : `${preUrl}/${problemId}/solutionCodes/${solutionCodeId}/update`,
                method : 'PATCH',
                body : updatedData
            }),
            invalidatesTags : ['admin']
        }),
        adminRemoveSolutionCode : builder.mutation<ApiSuccess<null>,RemoveSolutionCodeRequest>({
            query : ({problemId, solutionCodeId}) => ({
                url :  `${preUrl}/${problemId}/solutionCodes/${solutionCodeId}/remove`,
                method : 'DELETE'
            }),
            invalidatesTags : ['admin']
        }),
        


    })
})

export const {  

    useAdminListProblemQuery,
    useAdminGetProblemDetailsQuery,
    useAdminCreateProblemMutation,
    useAdminUpdateProblemDetailsMutation,
    useAdminAddTestCaseMutation,
    useAdminBulkUploadTestCaseMutation,
    useAdminRemoveTestCaseMutation,
    useAdminAddSolutionCodeMutation,
    useAdminUpdateSolutionCodeMutation,
    useAdminRemoveSolutionCodeMutation

} = adminProblemApiSlice