package pl.edu.pwr.programming_technologies.mapper;

import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;
import org.springframework.beans.factory.annotation.Autowired;
import pl.edu.pwr.programming_technologies.model.dto.ComplexTechnologyCategoryDTO;
import pl.edu.pwr.programming_technologies.model.dto.TechnologyCategoryDTO;
import pl.edu.pwr.programming_technologies.model.dto.UserDTO;
import pl.edu.pwr.programming_technologies.model.entity.TechnologyCategoryEntity;
import pl.edu.pwr.programming_technologies.repository.TechnologyCategoryRepository;

import java.util.List;

@Mapper
public interface TechnologyCategoryMapper {

    TechnologyCategoryMapper INSTANCE = Mappers.getMapper(TechnologyCategoryMapper.class);

    @Mapping(source = "parentTechnologyCategoryEntity", target = "parentTechnologyCategoryDTO")
    TechnologyCategoryDTO technologyCategoryEntityToTechnologyCategoryDTO(
            TechnologyCategoryEntity technologyCategoryEntity
    );

    List<TechnologyCategoryDTO> technologyCategoryEntityListToTechnologyCategoryDTOList(
            List<TechnologyCategoryEntity> technologyCategoryEntityList
    );

    @Mapping(source = "childrenTechnologyCategoryEntityList", target = "childrenTechnologyCategoryDTOList")
    ComplexTechnologyCategoryDTO technologyCategoryEntityToComplexTechnologyCategoryDTO(
            TechnologyCategoryEntity technologyCategoryEntity
    );

    List<ComplexTechnologyCategoryDTO> technologyCategoryEntityListToComplexTechnologyCategoryDTOList(
            List<TechnologyCategoryEntity> technologyCategoryEntityList
    );

    @Mapping(source = "childrenTechnologyCategoryDTOList", target = "childrenTechnologyCategoryEntityList")
    TechnologyCategoryEntity complexTechnologyCategoryDTOToTechnologyCategoryEntity(
            ComplexTechnologyCategoryDTO technologyCategoryEntity
    );

    List<TechnologyCategoryEntity> complexTechnologyCategoryDTOListToTechnologyCategoryEntityList(
            List<ComplexTechnologyCategoryDTO> technologyCategoryEntityList
    );
}
