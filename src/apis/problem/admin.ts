import { apiSlice } from "@/store/rtk-query/apiSlice";
import type { ApiSuccess } from "@/types/apiTypes";
import type { AddSolutionCodeRequest, AddTemplateCodeRequest, AddTestCaseRequest, BulkUploadTestCasesRequest, CheckQuestionIdAvailRequest, CheckTitleAvailRequest, CreateProblemRequest, RemoveSolutionCodeRequest, RemoveTemplateCodeRequest, RemoveTestCaseRequest, UpdateProblemRequest, UpdateSolutionCodeRequest, UpdateTemplateCodeRequest } from "@/types/problem-api-types/payload/admin";
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
        adminCheckQuestionId : builder.query<ApiSuccess<null>,CheckQuestionIdAvailRequest>({
            query : ({ questionId }) => ({
                url : `${preUrl}/checkQuestionId`,
                method : 'GET',
                params : { questionId }
            })    
        }),
        adminCheckTitle : builder.query<ApiSuccess<null>,CheckTitleAvailRequest>({
            query : ({title}) => ({
                url : `${preUrl}/checkTitle`,
                method : 'GET',
                params : { title }
            })
        }),
        adminCreateProblem : builder.mutation<ApiSuccess<null>,CreateProblemRequest>({
            query : (problemDetails) => ({
                url : `${preUrl}/create`,
                method : 'POST',
                body : problemDetails
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminUpdateProblemDetails : builder.mutation<ApiSuccess<null>,UpdateProblemRequest>({
            query : ({problemId, updatedData}) => ({
                url : `${preUrl}/${problemId}/update`,
                method : 'PATCH',
                body : updatedData
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminAddTestCase : builder.mutation<ApiSuccess<null>,AddTestCaseRequest>({
            query : ({problemId, testCaseData}) => ({
                url : `${preUrl}/${problemId}/testCases/add`,
                method : 'POST',
                body : testCaseData
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminBulkUploadTestCase : builder.mutation<ApiSuccess<null>,BulkUploadTestCasesRequest>({
            query : ({problemId, testCases}) => ({
                url : `${preUrl}/${problemId}/testCases/bulkUpload`,
                method : 'POST',
                body : testCases
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminRemoveTestCase : builder.mutation<ApiSuccess<null>,RemoveTestCaseRequest>({
            query : ({problemId, testCaseId, testCaseCollectionType}) => ({
                url : `${preUrl}/${problemId}/testCases/${testCaseId}/remove?testCaseCollectionType=${testCaseCollectionType}`,
                method : 'DELETE',
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminAddSolutionCode : builder.mutation<ApiSuccess<null>,AddSolutionCodeRequest>({
            query : ({problemId, solutionCode}) => ({
                url : `${preUrl}/${problemId}/solutionCodes/add`,
                method : 'POST',
                body : solutionCode
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminUpdateSolutionCode : builder.mutation<ApiSuccess<null>,UpdateSolutionCodeRequest>({
            query : ({problemId, solutionCodeId, updatedData}) => ({
                url : `${preUrl}/${problemId}/solutionCodes/${solutionCodeId}/update`,
                method : 'PATCH',
                body : updatedData
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminRemoveSolutionCode : builder.mutation<ApiSuccess<null>,RemoveSolutionCodeRequest>({
            query : ({problemId, solutionCodeId}) => ({
                url :  `${preUrl}/${problemId}/solutionCodes/${solutionCodeId}/remove`,
                method : 'DELETE'
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminAddTemplateCode : builder.mutation<ApiSuccess<null>,AddTemplateCodeRequest>({
            query : ({ problemId, templateCode }) => ({
                url : `${preUrl}/${problemId}/templateCodes/add`,
                method : 'POST',
                body : templateCode
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminUpdateTemplateCode : builder.mutation<ApiSuccess<null>,UpdateTemplateCodeRequest>({
            query : ({ problemId, templateCodeId, updatedData }) => ({
                url : `${preUrl}/${problemId}/templateCodes/${templateCodeId}/update`,
                method : 'PATCH',
                body : updatedData
            }),
            invalidatesTags : ['admin','public','user']
        }),
        adminRemoveTemplateCode : builder.mutation<ApiSuccess<null>,RemoveTemplateCodeRequest>({
            query : ({ problemId, templateCodeId }) => ({
                url : `${preUrl}/${problemId}/templateCodes/${templateCodeId}/remove`,
                method : 'DELETE'
            }),
            invalidatesTags : ['admin','public','user']
        })
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
    useAdminRemoveSolutionCodeMutation,
    useAdminCheckQuestionIdQuery,
    useAdminCheckTitleQuery,
    useAdminAddTemplateCodeMutation,
    useAdminUpdateTemplateCodeMutation,
    useAdminRemoveTemplateCodeMutation

} = adminProblemApiSlice